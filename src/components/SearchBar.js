import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import ResultsBox from "./ResultsBox"

class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			preSearchString: "",
			searchString: "",
		}
		this.pullFromURL = this.pullFromURL.bind(this);
		this.setPreSearchString = this.setPreSearchString.bind(this);
		this.setSearchString = this.setSearchString.bind(this);
		this.searchFromLink = this.searchFromLink.bind(this);
	}

	pullFromURL() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		if (urlSearchParams.has("search")) {
			this.setState({
				...this.state,
				preSearchString: urlSearchParams.get("search"),
				searchString: urlSearchParams.get("search"),
			});
		}
	}

	setPreSearchString(inString) {
		let adjInString = inString
  			.replace(/[\u2018\u2019\u0027]/g, "'")
  			.replace(/[\u201C\u201D]/g, '"');
		this.setState({
			...this.state,
			preSearchString: adjInString,
		});
	}

	setSearchString(e) {
		e.preventDefault();
		window.history.pushState(null, null, "?search=" + encodeURIComponent(this.state.preSearchString));
		this.setState({
			...this.state,
			searchString: this.state.preSearchString,
		});
		window.scroll({
			top: 0,
			left: 0,
			behavior: "instant",
		});
	}

	searchFromLink(inString, append = false) {
		let outString = "";
		if (append) {
			outString = this.state.searchString + " " + inString;
		} else {
			outString = inString;
		}
		window.history.pushState(null, null, "?search=" + encodeURIComponent(outString));
		this.setState({
			...this.state,
			preSearchString: outString,
			searchString: outString,
		});
		window.scroll({
			top: 0,
			left: 0,
			behavior: "instant",
		});
	}

	componentDidMount() {
		window.addEventListener('popstate', this.pullFromURL);
		this.pullFromURL();
	}

	componentWillUnmount() {
		window.removeEventListener('popstate', this.pullFromURL);
	}

	render() {
		return (
			<div  className="search-bar">
				<Helmet>
					<title>PonePonePone - MLP: FiM Transcript Search</title>
				</Helmet>
				<form onSubmit={this.setSearchString}>
					<input 
						type="search" 
						placeholder="Search Transcripts" 
						value={this.state.preSearchString}
						onInput={e => this.setPreSearchString(e.target.value)}
						name="searchbar"
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