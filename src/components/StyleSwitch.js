import React, { Component } from 'react';

class StyleSwitch extends Component {
	constructor(props) {
		super(props);
	}

	switchTheme() {
		console.log("switch!")
		let currentTheme = document.documentElement.getAttribute("data-theme");
	    let targetTheme = "light";

	    if (currentTheme === "light") {
	        targetTheme = "dark";
	    }

	    document.documentElement.setAttribute('data-theme', targetTheme)
	    localStorage.setItem('theme', targetTheme);
	}

	componentDidMount() {
		let storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
		if (storedTheme) {
			document.documentElement.setAttribute('data-theme', storedTheme)
		}
  	}

	render() {
		return (
			<div  className="style-switch">
				<button onClick={this.switchTheme}></button>
			</div>
		);
	}
}

export default StyleSwitch;