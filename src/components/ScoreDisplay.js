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
        <div className="score">Score: {this.state.dispScore}</div>
        <div className="streak">
          <span className="streak-display">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-fire" viewBox="0 0 16 16">
              <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
            </svg> {this.props.streak} streak!
          </span>
        </div>
      </div>
    );
  }
}

export default ScoreDisplay;