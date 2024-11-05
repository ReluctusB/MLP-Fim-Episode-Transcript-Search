use regex::Regex;
use serde::{Serialize, Deserialize};
use serde_json::Error;
use std::{collections::HashMap, fs, fs::File, io::BufReader};

// Path to transcript data
const TRANSCRIPT_FILEPATH: &str = "../src/assets/episodes.json";
// Path to output file
const OUTPUT_FILEPATH: &str = "../src/assets/game_tf_idf.json";

// Difficulty score cutoffs. Lines will be sorted into each category if their
// score is greater than or equal that category's cutoff. 
const VERY_EASY_CUTOFF: f64 = 1.0;
const EASY_CUTOFF: f64 = 0.8;
const NORMAL_CUTOFF: f64 = 0.6;
const HARD_CUTOFF: f64 = 0.3;
// Very hard is anything under HARD_CUTOFF

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
        match corpus.serialize() {
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
struct OutputDocument<'a> {
    lines_by_difficulty: HashMap<&'a str, Vec<OutputLine>>,
    count_by_difficulty: HashMap<&'a str, i32>,
    episode_titles: Vec<String>,
}

#[derive(Clone, Default, Serialize)]
struct OutputLine {
    line: String,
    score: f64,
    title: String,
    number_in_season: i32,
    season: i32,
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

    fn serialize(&self) -> Result<String, Error> {
        let mut output_document = OutputDocument {
            lines_by_difficulty: HashMap::from([
                ("very_easy", vec![]),
                ("easy", vec![]),
                ("normal", vec![]),
                ("hard", vec![]),
                ("very_hard", vec![]),
            ]),
            count_by_difficulty: HashMap::from([
                ("very_easy", 0),
                ("easy", 0),
                ("normal", 0),
                ("hard", 0),
                ("very_hard", 0),
            ]),
            ..Default::default()
        };

        for (_key, document) in self.documents.clone() {

            output_document.episode_titles.push(document.title.clone());

            // for each line in the episode document...
            for (i, terms) in document.terms.iter().enumerate() {
                // sum the tf-idf values for each term
                let total_score: f64 = terms
                    .iter()
                    .map(|term| *document.tf_idf.get(term).unwrap())
                    .sum();

                // skip lines <20 or >120 characters, excluding the speaking character text
                if document.original[i].split_once(": ").unwrap().1.len() < 20
                    || document.original[i].split_once(": ").unwrap().1.len() > 120
                {
                    continue;
                }

                let output_line = OutputLine {
                    line: document.original[i].clone(),
                    score: total_score,
                    title: document.title.clone(),
                    number_in_season: document.number_in_season.clone(),
                    season: document.season.clone(),
                };

                let bucket: &str;
                if total_score >= VERY_EASY_CUTOFF {
                    bucket = "very_easy"; 
                } else if total_score >= EASY_CUTOFF {
                    bucket = "easy"; 
                } else if total_score >= NORMAL_CUTOFF {
                    bucket = "normal"; 
                } else if total_score >= HARD_CUTOFF {
                    bucket = "hard"; 
                } else {
                    bucket = "very_hard";
                }

                output_document.lines_by_difficulty.get_mut(bucket).unwrap().push(output_line);
                *output_document.count_by_difficulty.get_mut(bucket).unwrap() += 1;
            }
            
        }
        
        serde_json::to_string(&output_document)
    }
}
