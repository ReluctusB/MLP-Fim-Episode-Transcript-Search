use ordered_float::OrderedFloat;
use regex::Regex;
use serde::{Serialize, Deserialize};
use serde_json::Error;
use std::{collections::HashMap, fs, fs::File, io::BufReader};

// Top n quotes from each episode to include in output
const TOP_N: usize = 30;
// Path to transcript data
const TRANSCRIPT_FILEPATH: &str = "../src/assets/episodes.json";
// Path to output file
const OUTPUT_FILEPATH: &str = "../src/assets/game_tf_idf.json";

// types for the episodes.json, only including fields we care about
type Series = HashMap<String, Episode>;

#[derive(Clone, Deserialize)]
struct Episode {
    title: String,
    #[serde(default)]
    number_in_season: i32,
    #[serde(default)]
    season: i32,
    #[serde(rename = "transcript")]
    lines: Vec<Line>,
}

#[derive(Clone, Deserialize)]
struct Line {
    character: String,
    #[serde(rename = "line")]
    text: String,
}

// time how long an expression takes and print it
macro_rules! timed {
    ($name:expr, $timed:expr) => {{
        let start = std::time::Instant::now();
        let result = $timed;
        let end = std::time::Instant::now();
        println!("{} ({} μs)", $name, end.duration_since(start).as_micros());
        result
    }};
}

fn main() {
    // load transcripts
    let mut transcripts: HashMap<String, Episode> = timed!("Load transcripts", {
        let file = File::open(TRANSCRIPT_FILEPATH).expect("Couldn't open episodes.json!");
        let buf = BufReader::new(file);

        serde_json::from_reader(buf).unwrap()
    });

    // add the speaking character to the line text as extra input
    for episode in transcripts.values_mut() {
        for line in episode.lines.iter_mut() {
            line.text = format!("{}: {}", line.character, line.text);
        }
    }

    println!("=================================================");
    let corpus = timed!("Process series corpus", {
        let mut corpus = SeriesCorpus::default();
        corpus.process(transcripts);
        corpus
    });

    /*
    for i in range {
        println!("=================================================");
        for line in corpus.summarize(i.to_string(), top_n) {
            println!("{line}");
        }
    }
    */
    println!("=================================================");
    let output_json = timed!("Serialize tf_idf episode data", {
        match corpus.serialize(TOP_N) {
            Ok(json) => json,
            Err(e) => panic!("Couldn't serialize tf_idf episode data! Error: {e:?}")
        }
    });

    println!("=================================================");
    timed!("Write output file", {
        fs::write(OUTPUT_FILEPATH, output_json).expect("Couldn't write to game_tf_idf.json!");
    });
    
    println!("Written to {OUTPUT_FILEPATH:?}");

    println!("=================================================");
    println!("Done!");

}

#[derive(Default)]
struct SeriesCorpus {
    documents: HashMap<String, EpisodeDocument>,
    term_occurrences: HashMap<String, usize>,
}

#[derive(Clone, Default)]
struct EpisodeDocument {
    title: String,
    number_in_season: i32,
    season: i32,
    original: Vec<String>,
    terms: Vec<Vec<String>>,
    term_occurrences: HashMap<String, usize>,
    tf_idf: HashMap<String, f64>,
}

#[derive(Clone, Default, Serialize)]
struct OutputDocument {
    seasons: HashMap<i32, Vec<OutputEpisode>>,
}

#[derive(Clone, Default, Serialize)]
struct OutputEpisode {
    title: String,
    number_in_season: i32,
    season: i32,
    lines: Vec<OutputLine>,
}

#[derive(Clone, Default, Serialize)]
struct OutputLine {
    line: String,
    score: f64
}

impl SeriesCorpus {
    fn process(&mut self, series: Series) {
        // regex matching alphabetic and space characters
        let word_re = Regex::new(r"([^a-zA-Z ]+)").unwrap();

        for (id, episode) in series {
            // the terms for each line in an episode
            let mut episode_terms = Vec::with_capacity(episode.lines.len());
            // how many times each term occurs in the episode
            let mut term_occurrences = HashMap::new();

            for line in &episode.lines {
                // strip unwanted characters and split into words, which are the terms to operate on
                let terms: Vec<String> = word_re
                    .replace_all(&line.text, "")
                    .split_ascii_whitespace()
                    .map(String::from)
                    .collect();

                // increment counts for term occurrences within the document
                for term in &terms {
                    *term_occurrences.entry(term.clone()).or_default() += 1;
                }

                episode_terms.push(terms);
            }

            // increment counts for the terms that appear in this document
            for term in term_occurrences.keys() {
                *self.term_occurrences.entry(term.clone()).or_default() += 1;
            }

            // keep a copy of the original lines with the document so they can be shown later
            let original = episode.lines.into_iter().map(|line| line.text).collect();

            self.documents.insert(
                id.clone(),
                EpisodeDocument {
                    title: episode.title,
                    number_in_season: episode.number_in_season,
                    season: episode.season,
                    original,
                    terms: episode_terms,
                    term_occurrences,
                    tf_idf: HashMap::new(),
                },
            );
        }

        // calculate tf-idf for each term in each document
        let num_documents = self.documents.len() as f64;
        for document in self.documents.values_mut() {
            for (term, count) in &document.term_occurrences {
                /*
                tf = term occurrences in doc / terms in doc
                idf = log_e(docs / docs term occurs in)
                tf-idf = tf * idf
                 */
                let tf = *count as f64 / document.terms.len() as f64;
                let idf = (num_documents / *self.term_occurrences.get(term).unwrap() as f64).ln();
                let tf_idf = tf * idf;
                document.tf_idf.insert(term.clone(), tf_idf);
            }
        }
    }

    fn serialize(&self, top_n: usize) -> Result<String, Error> {
        let mut output_document: OutputDocument = Default::default();

        for (_key, document) in self.documents.clone() {
            let mut output_episode = OutputEpisode {
                title: document.title,
                number_in_season: document.number_in_season,
                season: document.season,
                ..Default::default()
            };
            let mut scores = Vec::with_capacity(document.terms.len());

            // for each line in the episode document...
            for (i, terms) in document.terms.iter().enumerate() {
                // sum the tf-idf values for each term
                let mut total_score: f64 = terms
                    .iter()
                    .map(|term| *document.tf_idf.get(term).unwrap())
                    .sum();

                // zero out the score for lines <20 or >120 characters, excluding the speaking character text
                if document.original[i].split_once(": ").unwrap().1.len() < 20
                    || document.original[i].split_once(": ").unwrap().1.len() > 120
                {
                    total_score = 0.0;
                }

                // save the line's score
                scores.push((i, OrderedFloat(total_score)));
            }

            // sort by score, take the top_n scoring lines, and format to add the line number and score
            scores.sort_by_key(|(_, score)| -*score);

            scores
                .into_iter()
                .take(top_n)
                .for_each(|(line, score)| {
                    let output_line = OutputLine {
                        line: document.original[line].clone(),
                        score: *score
                    };
                    output_episode.lines.push(output_line);
                });

            let season = output_document.seasons.get_mut(&document.season);
            match season {
                None => {
                    output_document.seasons.insert(document.season, vec![output_episode]);
                },
                Some(s) => {
                    s.push(output_episode);
                },
            }
            
        }
        
        serde_json::to_string(&output_document)
    }
}
