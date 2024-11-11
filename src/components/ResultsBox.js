import React, { Component } from 'react';
import LineBox from "./LineBox";
import ErrorBox from "./ErrorBox";
import LoadingIcon from "./LoadingIcon";

const ResultsOrder = Object.freeze({
	EPISODE: 0,
	DATE: 1,
});

class ResultsBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			matches: [],
			errorMsg: {
				msg: "",
				link: "",
			},
			loadingResults: false,
		}
		this.episodeDatabase = null;
		this.searchDb = this.searchDb.bind(this);
		this.clearMatches = this.clearMatches.bind(this);
	}

	async searchDb() {
		let startTimestamp = performance.now();
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
		let writerString = null;
		let orderBy = ResultsOrder.EPISODE;
		let reverseMatches = false;

		let tags = checkString.match( /{.*?}/gi);
		for (const tag in tags) {
			if (tags[tag].startsWith("{character:")) {
				checkString = checkString.replace(tags[tag], "");
				charString = tags[tag].replace("{character:", "").replace("}", "").trim();
			} else if (tags[tag].startsWith("{episode:")) {
				checkString = checkString.replace(tags[tag], "");
				epString = tags[tag].replace("{episode:", "").replace("}", "").trim();
			} else if (tags[tag].startsWith("{writer:")) {
				checkString = checkString.replace(tags[tag], "");
				writerString = tags[tag].replace("{writer:", "").replace("}", "").trim();
			} else if (tags[tag].startsWith("{order:")) {
				checkString = checkString.replace(tags[tag], "");
				let orderString = tags[tag].replace("{order:", "").replace("}", "").trim().toLowerCase();

				if (orderString.indexOf("reverse") !== -1) {
					reverseMatches = true;
					orderString = orderString.replace("reverse", "").trim();
				}
				switch(orderString) {
					case "date":
						orderBy = ResultsOrder.DATE;
						break;
					case "episode":
					default:
						break;
				}
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
				loadingResults: false,
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
					loadingResults: false,
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
					loadingResults: false,
				});
				return;
			}
		}

		// Writer parameter regex
		let writerRegex;
		if(writerString) {
			try {
				writerRegex = new RegExp(writerString, "i");
			} catch(err) {
				console.error(err);
				const errMsg = {
					msg: "Regular expression in writer parameter was malformed! Check for unclosed brackets or parentheses, or look at the console for details!",
					link: "/?page=help#regex"
				}
				this.setState({
					...this.state,
					matches: [],
					errorMsg: errMsg,
					loadingResults: false,
				});
				return;
			}
		}

		if (this.episodeDatabase === null) {
			this.episodeDatabase = await import("../assets/episodes.json");
		}
		
		let matchArray = []
		for (const prop in this.episodeDatabase) {
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
					if (writerString) {
						if (!writerRegex.test(this.episodeDatabase[prop].writers)) {
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
						airDate: Date.parse(this.episodeDatabase[prop].airdate.replace(/-/g, "/")),
						writers: this.episodeDatabase[prop].writers
					})
				}
			})
		}

		switch(orderBy) {
			case ResultsOrder.DATE:
				matchArray.sort((a, b) => {
					return (a.airDate - b.airDate);
				});
				break;
			default:
				break;
		}

		if (reverseMatches) {
			matchArray.reverse();
		}

		console.log(this.props.searchString + " | " + (performance.now() - startTimestamp) + " ms");

		this.setState({
			...this.state,
			matches: matchArray,
			loadingResults: false,
			errorMsg: {
				msg: "",
				link: "",
			},
		});
	}

	clearMatches() {
		this.setState({
			...this.state,
			matches: [],
			loadingResults: false,
		});
	}

	componentDidUpdate(prevProps) {
  		if (this.props.searchString !== prevProps.searchString) {
    		this.setState({
				...this.state,
				loadingResults: true,
			}, () => this.searchDb());
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
					{this.state.loadingResults ? (<LoadingIcon />) : null}
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