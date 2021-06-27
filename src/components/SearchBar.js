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
	}

	setPreSearchString(inString) {
		this.setState({
			...this.state,
			preSearchString: inString,
		});
	}

	setSearchString(e) {
		e.preventDefault();
		this.setState({
			...this.state,
			searchString: this.state.preSearchString,
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
					<button type="submit">Go</button>
					<a href="https://github.com/ReluctusB/MLP-Fim-Episode-Transcript-Search#search-help">Help</a>
				</form>

				<ResultsBox
					searchString = {this.state.searchString}
				/>
			</div>
		);
	}
}

export default SearchBar;