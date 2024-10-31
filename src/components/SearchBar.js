import React, { Component } from 'react';

import ResultsBox from "./ResultsBox"

class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			preSearchString: "",
			searchString: "",
		}
		this.setPreSearchString = this.setPreSearchString.bind(this);
		this.setSearchString = this.setSearchString.bind(this);
		this.searchFromLink = this.searchFromLink.bind(this);
	}

	componentDidMount() {
		const urlSearchParams = new URLSearchParams(window.location.search)
		if (urlSearchParams.has("search")) {
			this.setState({
				...this.state,
				preSearchString: urlSearchParams.get("search"),
				searchString: urlSearchParams.get("search"),
			});
		}
	}

	setPreSearchString(inString) {
		this.setState({
			...this.state,
			preSearchString: inString,
		});
	}

	setSearchString(e) {
		e.preventDefault();
		window.history.replaceState(null, null, "?search=" + encodeURIComponent(this.state.preSearchString));
		this.setState({
			...this.state,
			searchString: this.state.preSearchString,
		});
	}

	searchFromLink(inString) {
		window.history.replaceState(null, null, "?search=" + encodeURIComponent(inString));
		this.setState({
			...this.state,
			preSearchString: inString,
			searchString: inString,
		});
	}

	render() {
		return (
			<div  className="search-bar">
				<form onSubmit={this.setSearchString}>
					<input 
						type="search" 
						placeholder="Search Transcripts" 
						value={this.state.preSearchString}
						onInput={e => this.setPreSearchString(e.target.value)}
					/>
					<button type="submit" title="Search!">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-search-heart-fill" viewBox="0 0 16 16">
					  <path d="M6.5 13a6.47 6.47 0 0 0 3.845-1.258h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1A6.47 6.47 0 0 0 13 6.5 6.5 6.5 0 0 0 6.5 0a6.5 6.5 0 1 0 0 13m0-8.518c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018"/>
					</svg>
					</button>
				</form>

				<ResultsBox
					searchString = {this.state.searchString}
					searchFromLink = {this.searchFromLink}
				/>
			</div>
		);
	}
}

export default SearchBar;