import React, { Component } from 'react';

class ToTop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shown: false
		}
		this.scrollCheck = this.scrollCheck.bind(this);
		this.goToTop = this.goToTop.bind(this);
	}

	scrollCheck() {
		if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)) {
			if (!this.state.shown) {
				this.setState({
					...this.state,
					shown: true,
				});
			}
		} else {
			if (this.state.shown) {
				this.setState({
					...this.state,
					shown: false,
				});
			}
		}
	}

	goToTop() {
		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	}

	componentDidMount() {
		window.addEventListener('scroll', this.scrollCheck);
		this.scrollCheck();
  	}

	render() {
		return (
			<div id="to-top" className={this.state.shown ? "shown" : "hidden"} onScroll={this.scrollCheck}>
				<button onClick = {this.goToTop} title="Scroll To Top">
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
					  <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0"/>
					</svg>
				</button>
			</div>
		);
	}
}

export default ToTop;