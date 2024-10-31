import React, { Component } from 'react';

const highlightEvent = new Event("highlight");

class LineBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			highlighted: false,
		}
		this.eleRef = React.createRef();
		this.highlightCheck = this.highlightCheck.bind(this);
		this.copyLine = this.copyLine.bind(this);
		this.linkTo = this.linkTo.bind(this);
	}

	highlightCheck() {
		console.log("HIGHLIGHTING");
		let urlSearchParams = new URLSearchParams(window.location.search);
		if (urlSearchParams.has("scroll_to")) {
			this.setState({
				...this.state,
				highlighted: (urlSearchParams.get("scroll_to") === this.props.index.toString()),
			});
			if (urlSearchParams.get("scroll_to") === this.props.index.toString()) {
				this.eleRef.current.scrollIntoView({behavior: "smooth", block: "center"})
			}
		}
	}

	linkTo() {
		let urlSearchParams = new URLSearchParams(window.location.search);
		urlSearchParams.set("scroll_to", this.props.index);
		window.history.replaceState({scrollTo: this.props.index}, null, "?" + urlSearchParams.toString());
		navigator.clipboard.writeText(window.location);
		window.dispatchEvent(highlightEvent);
	}

	copyLine() {
		let lineCopy = this.props.line.speaker + ": " + this.props.line.line;
		navigator.clipboard.writeText(lineCopy);
	}

	componentDidMount() {
		window.addEventListener('highlight', this.highlightCheck);
		this.highlightCheck();
  	}

	render() {
		return (
			<div ref={this.eleRef} className={this.state.highlighted ? "line-box highlighted" : "line-box"}>
				<a href="#" onClick={() => this.props.searchFromLink("{character: " + this.props.line.speaker + "}")}>{this.props.line.speaker}</a>: {this.props.line.line} 
				<div >
					- <small><a href="#" onClick={() => this.props.searchFromLink("{episode: " + this.props.line.episode + "}")}>{this.props.line.episode}</a> | S{this.props.line.season} E{this.props.line.eNumber} | 
						<button title="Copy Link to This Line" onClick={this.linkTo}>
							<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
								<path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
								<path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
							</svg>
						</button>|<button title="Copy Line" onClick={this.copyLine}>
							<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
								<path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
							</svg>
						</button>
					</small>  - 
				</div>
			</div>
		);
	}
}

export default LineBox;