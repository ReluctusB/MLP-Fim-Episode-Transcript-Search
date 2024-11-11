import React, { Component } from 'react';

class Pluralizer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pluralized: this.props.number !== 1,
		}
	}

	static getDerivedStateFromProps(props, state) {
		return {
			...state,
			pluralized: props.number !== 1,
		}
	}

	render() {
		return(
			<span>
				{this.props.number || "0"} {this.props.children}{this.state.pluralized ? "s" : null}
			</span>
		);
	}
}

export default Pluralizer;