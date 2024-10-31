import React, { Component } from 'react';

import episodeDatabase from "../assets/episodes.json"


class ResultsBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			matches: []
		}
	}

	searchDb() {
		if (!this.props.searchString) {
			return;
		}
		let checkString = this.props.searchString.trim();
		let charString = null;
		let epString = null;

		let tags = checkString.match( /{.*?}/gi);
		for (const tag in tags) {
			if (tags[tag].startsWith("{character:")) {
				checkString = checkString.replace(tags[tag], "")
				charString = tags[tag].replace("{character:", "").replace("}", "").trim()
			} else if (tags[tag].startsWith("{episode:")) {
				checkString = checkString.replace(tags[tag], "")
				epString = tags[tag].replace("{episode:", "").replace("}", "").trim()
			}
		}


		checkString = checkString.trim();

		let searchRegex = new RegExp(checkString, "i");
		let matchArray = []

		for (const prop in episodeDatabase) {
			episodeDatabase[prop].transcript.forEach(lines => {
				if (searchRegex.test(lines.line)) {
					if (charString) {
						let charRegex = new RegExp(charString, "i");
						if (!charRegex.test(lines.character)) {
							return
						}
					}
					if (epString) {
						let epRegex = new RegExp(epString, "i");
						if (!epRegex.test(episodeDatabase[prop].title)) {
							return
						}
					}
					matchArray.push({
						line: lines.line,
						speaker: lines.character,
						episode: episodeDatabase[prop].title,
						eNumber: episodeDatabase[prop].number_in_season ? episodeDatabase[prop].number_in_season : "N/A",
						season: episodeDatabase[prop].season ? episodeDatabase[prop].season : "N/A",
						link: episodeDatabase[prop].transcript_url,
					})
				}
			})
		}

		this.setState({
			...this.state,
			matches: matchArray
		});
	}

	componentDidUpdate(prevProps) {
  		if (this.props.searchString !== prevProps.searchString) {
    		this.searchDb();
  		}
	}

	render() {
		return (
			<div  className="results-box">
				<p>Searching for: {this.props.searchString}</p>

				<hr/>

				<p><small>
					{
						(this.state.matches.length || !this.props.searchString) ? this.state.matches.length : "0"
					} Result(s):
				</small></p>

				<div>
					{
						this.state.matches.map((line, index) => (
							<div key={index} className="line-box">
								<a href="#" onClick={() => this.props.searchFromLink("{character: " + line.speaker + "}")}>{line.speaker}</a>: {line.line} 
								<div >
									- <small><a href="#" onClick={() => this.props.searchFromLink("{episode: " + line.episode + "}")}>{line.episode}</a> | Season {line.season} Episode {line.eNumber}</small> -
								</div>
							</div>
						))
					}
					
				</div>
			</div>
		);
	}
}

export default ResultsBox;