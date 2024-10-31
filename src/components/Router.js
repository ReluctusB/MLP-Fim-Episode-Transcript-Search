import React, { Component } from 'react';
import SearchBar from "./SearchBar";
import HelpInfo from "./HelpInfo";

class Router extends Component {
	constructor(props) {
		super(props);
		this.state = {
			curPage: "/"
		}
		this.urlCheck = this.urlCheck.bind(this);
	}

	urlCheck() {
		console.log(window.location.pathname)
		this.setState({
			...this.state,
			curPage: window.location.pathname,
		});
	}

	componentDidMount() {
		window.addEventListener('popstate', this.urlCheck);
		this.urlCheck();
  	}

  	render() {
  		switch(this.state.curPage) {
  			case "/MLP-Fim-Episode-Transcript-Search":
  				return (<SearchBar/>);
  			case "/MLP-Fim-Episode-Transcript-Search/help":
  				return (<HelpInfo/>);
  			default:
  				return (<div>AAAAAA</div>);
  		}
	}
}

export default Router;