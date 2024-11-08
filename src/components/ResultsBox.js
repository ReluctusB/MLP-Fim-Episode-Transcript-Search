import React, { Component } from 'react';
import LineBox from "./LineBox";
import ErrorBox from "./ErrorBox";

class ResultsBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			matches: [],
			errorMsg: {
				msg: "",
				link: "",
			},
		}
		this.episodeDatabase = null;
		this.searchDb = this.searchDb.bind(this);
		this.clearMatches = this.clearMatches.bind(this);
	}

	async searchDb() {
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

		// Main search body regex
		let searchRegex;
		try {
			searchRegex = new RegExp(checkString, "i");
		} catch(err) {
			console.error(err);
			const errMsg = {
				msg: "Regular expression in search body was malformed! Check for unclosed brackets or parentheses, or look at the console for details!",
				link: "/?page=help#regex"
			}
			this.setState({
				...this.state,
				matches: [],
				errorMsg: errMsg,
			});
			return;
		}

		// Character parameter regex
		let charRegex;
		if (charString) {
			try {
				charRegex = new RegExp(charString, "i");
			} catch(err) {
				console.error(err);
				const errMsg = {
					msg: "Regular expression in character parameter was malformed! Check for unclosed brackets or parentheses, or look at the console for details!",
					link: "/?page=help#regex"
				}
				this.setState({
					...this.state,
					matches: [],
					errorMsg: errMsg,
				});
				return;
			}
		}

		// Episode parameter regex
		let epRegex;
		if(epString) {
			try {
				epRegex = new RegExp(epString, "i");
			} catch(err) {
				console.error(err);
				const errMsg = {
					msg: "Regular expression in episode parameter was malformed! Check for unclosed brackets or parentheses, or look at the console for details!",
					link: "/?page=help#regex"
				}
				this.setState({
					...this.state,
					matches: [],
					errorMsg: errMsg,
				});
				return;
			}
		}

		if (this.episodeDatabase === null) {
			this.episodeDatabase = await import("../assets/episodes.json");
		}
		
		let matchArray = []
		for (const prop in this.episodeDatabase) {
			console.log(this.episodeDatabase[prop]);
			if (isNaN(prop)) { continue; }
			this.episodeDatabase[prop].transcript.forEach(lines => {
				if (searchRegex.test(lines.line)) {
					if (charString) {
						if (!charRegex.test(lines.character)) {
							return
						}
					}
					if (epString) {
						if (!epRegex.test(this.episodeDatabase[prop].title)) {
							return
						}
					}
					matchArray.push({
						line: lines.line,
						speaker: lines.character,
						episode: this.episodeDatabase[prop].title,
						eNumber: this.episodeDatabase[prop].number_in_season ? this.episodeDatabase[prop].number_in_season : "N/A",
						season: this.episodeDatabase[prop].season ? this.episodeDatabase[prop].season : "N/A",
						link: this.episodeDatabase[prop].transcript_url,
					})
				}
			})
		}

		this.setState({
			...this.state,
			matches: matchArray,
			errorMsg: {
				msg: "",
				link: "",
			},
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

				<ErrorBox 
					msg={this.state.errorMsg.msg}
					link = {this.state.errorMsg.link}
				/>
				
			</div>
		);
	}
}

export default ResultsBox;