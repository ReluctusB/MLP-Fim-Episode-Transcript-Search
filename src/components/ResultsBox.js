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

		let searchRegex = new RegExp(this.props.searchString, "i");
		let matchArray = []

		for (const prop in episodeDatabase) {
			episodeDatabase[prop].transcript.forEach(lines => {
				if (searchRegex.test(lines.line)) {
					matchArray.push({
						line: lines.line,
						speaker: lines.character,
						episode: episodeDatabase[prop].title,
						eNumber: episodeDatabase[prop].number_overall
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
								<b>{line.speaker}</b>: {line.line} 
								<div >
									- <small>{line.episode} | ep. {line.eNumber}</small> -
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