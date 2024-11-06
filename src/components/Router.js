import React, { Component } from 'react';
import SearchBar from "./SearchBar";
import HelpInfo from "./HelpInfo";
import PoneQuiz from "./PoneQuiz";

class Router extends Component {
	constructor(props) {
		super(props);
		this.state = {
			curPage: "/"
		}
		this.urlCheck = this.urlCheck.bind(this);
	}

	urlCheck() {
		const urlSearchParams = new URLSearchParams(window.location.search)
		if (urlSearchParams.has("page")) {
			this.setState({
				...this.state,
				curPage: urlSearchParams.get("page"),
			});
		} else {
			this.setState({
				...this.state,
				curPage: "",
			});
		}
		
	}

	componentDidMount() {
		window.addEventListener('popstate', this.urlCheck);
		this.urlCheck();
  	}

  	render() {
  		switch(this.state.curPage) {
  			case "":
  				return (<SearchBar/>);
  			case "help":
  				return (<HelpInfo/>);
  			case "pone_quiz":
  				return (<PoneQuiz/>);
  			default:
  				return (
  					<div className="error-page page">
  						<hr/>
  						<h2>Wuhoh! That's a 404 error!</h2>
  						<p>We couldn't find that page! Maybe a cragadile ate it. Or a timberwolf. Or a—</p>
  						<p>Regardless, check your url. You can click the page title to return to safer ground. Or, if you're seeing this page and you really don't think you should be, open an issue on our <a href="https://github.com/ReluctusB/MLP-Fim-Episode-Transcript-Search/issues">Github.</a></p>
  					</div>
  				);
  		}
	}
}

export default Router;