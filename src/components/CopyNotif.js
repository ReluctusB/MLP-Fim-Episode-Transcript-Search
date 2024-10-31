import React, { Component } from 'react';

class CopyNotif extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shown: false,
			copyType: "Line",
		}
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
	}

	show(e) {
		this.setState({
			...this.state,
			shown: true,
			copyType: e.detail.copyType
		});
		setTimeout(this.hide, 3000);
	}

	hide() {
		this.setState({
			...this.state,
			shown: false,
		});
	}

	componentDidMount() {
		window.addEventListener('customcopy', this.show);
  	}

	render() {
		return (
			<div id="copy-notif" className={this.state.shown ? "shown" : ""}>
				<p>{this.state.copyType} copied!</p>
			</div>
		);
	}
}

export default CopyNotif;