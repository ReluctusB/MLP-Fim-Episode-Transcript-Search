import React, { Component } from 'react';

class ScoreDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dispScore: this.props.prevScore,
      targetScore: this.props.score,
      prevPrevScore: this.props.prevScore,
    }
    this.adjustDisplay = this.adjustDisplay.bind(this);
  }

  adjustDisplay() {
    if (this.state.dispScore === this.state.targetScore) {
      return;
    }
    let newScore = 0;
    if (this.state.dispScore < this.state.targetScore) {
      newScore = this.state.dispScore + 5;
       this.setState({
        ...this.state,
        dispScore: newScore,
      });
    } else if (this.state.dispScore > this.props.score) {
      newScore = this.state.dispScore - 5;
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
        if (props.prevScore !== state.prevPrevScore) {
          return {
            ...state,
            targetScore: props.score,
            dispScore: props.prevScore,
            prevPrevScore: props.prevScore,
          };
        } else {
          return {
            ...state,
            targetScore: props.score,
          };
        }
        
      } else {
        return {
          ...state,
          dispScore: 0,
          targetScore: 0,
          prevPrevScore: 0,
        };
      }
  }

  render() {
    return(
      <div className="score-display">
        <div className="score"><div>Score: {this.state.dispScore}</div></div>
        <div className="question-number"><div>Question #{this.props.questionNumber}</div></div>
        <div className="streak"><div>Streak: {this.props.streak}</div></div>
      </div>
    );
  }
}

export default ScoreDisplay;