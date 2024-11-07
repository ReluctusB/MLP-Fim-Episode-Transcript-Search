import React, { Component } from 'react';

const PrettyDifficulties = [
	"Very Easy",
	"Easy",
	"Normal",
	"Hard",
	"Very Hard",
];

class ResultsHistory extends Component {
	render() {
    	return (
    		<div className="results-history">
    		<h3>Round History</h3>
    		<p>You got {this.props.rightCount} right and {this.props.wrongCount} wrong.{this.props.wrongCount === 0 ? " A perfect game!" : ""}</p>
	    		<div className="table-row table-head">
	    			<div>Question</div>
	    			<div>Diffculty</div>
	    			<div>Correct</div>
	    		</div>
    			{
					this.props.history.map((entry, index) => (
						<div key={index} className={entry.correct ? "table-row correct" : "table-row incorrect"}>
							<div>{index + 1}</div>
							<div>{PrettyDifficulties[entry.difficulty]}</div>
							<div>{
								entry.correct ? (
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
	  									<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
									</svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
									 	<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
									</svg>)
								}
							</div>
						</div>
					))
				}
    		</div>
    	);
  	}
}

export default ResultsHistory;