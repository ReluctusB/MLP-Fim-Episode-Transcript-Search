import React, { Component } from 'react';
import LineBox from "./LineBox"

import episodeDatabase from "../assets/episodes.json"


class ResultsBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			matches: []
		}
		this.searchDb = this.searchDb.bind(this);
		this.clearMatches = this.clearMatches.bind(this);
	}

	searchDb() {
		if (!this.props.searchString) {
			this.clearMatches();
			return;
		}
		
		let checkString = this.props.searchString.trim();

		// Make sure search contains a character, not including an unescaped doublequote.
		let checkRealSearchRegex = /[^"]/;
		if (!checkRealSearchRegex.test(checkString)) {
			this.clearMatches();
			return;
		}

		// Swap unescaped quotes for \b 
		checkString = checkString.replace(/(?<!\\)"/gi, "\\b")

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

	clearMatches() {
		this.setState({
			...this.state,
			matches: []
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
							<LineBox 
								key = {index}
								line={line} 
								index={index}
								searchFromLink = {this.props.searchFromLink}
							/>
						))
					}
					
				</div>
			</div>
		);
	}
}

export default ResultsBox;