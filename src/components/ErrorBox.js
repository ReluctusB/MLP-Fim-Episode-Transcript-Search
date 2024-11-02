import React, { Component } from 'react';

class ErrorBox extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (!this.props.msg) {
			return null;
		}

		let link;
		if (this.props.link) {
			link = <p>Click <a href={this.props.link}>here</a> for more info.</p>
		}

		return (
			<div className="err-box">
				<p>Error! {this.props.msg}</p>
				{link}
			</div>
		);
	}
}

export default ErrorBox;