import React, { Component } from 'react';

class ScoreDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dispScore: this.props.score,
    }
    this.adjustDisplay = this.adjustDisplay.bind(this);
  }

  adjustDisplay() {
    let newScore = 0;
    if (this.state.dispScore < this.state.targetScore) {
      newScore = this.state.dispScore += 1;
       this.setState({
        ...this.state,
        dispScore: newScore,
      });
    } else if (this.state.dispScore > this.props.score) {
       this.setState({
        ...this.state,
        dispScore: newScore,
      });
    }
  }

  componentDidMount() {
    this.refreshInterval = setInterval(this.adjustDisplay, 2);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  static getDerivedStateFromProps(props, state) {
      if (props.score !== 0) {
        return {
          ...state,
          targetScore: props.score,
        };
      } else {
        return {
          ...state,
          dispScore: 0,
          targetScore: 0,
        };
      }
  }

  render() {
    return(
      <div className="score-display">
        {this.state.dispScore}
      </div>
    );
  }
}

export default ScoreDisplay;