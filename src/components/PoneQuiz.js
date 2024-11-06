import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import ScoreDisplay from "./ScoreDisplay";
import gameData from "../assets/game_tf_idf.json";

const GameStates = Object.freeze({
	START: 0,
	QUESTION: 1,
	BETWEEN_QUESTION: 2,
	GAME_OVER: 3,
	CORRECT: 4,
	INCORRECT: 5,
	FINISHED: 6,
});

const GameModes = Object.freeze({
	TWENTYQ: 0,
	ENDLESS: 1,
});

const Difficulties = [
	"very_easy",
	"easy",
	"normal",
	"hard",
	"very_hard",
];

const PrettyDifficulties = [
	"Very Easy",
	"Easy",
	"Normal",
	"Hard",
	"Very Hard",
];

const PointValues = [
	100,
	1000,
	2000,
	5000,
	10000,
];

const Multipliers = [
	1,
	1,
	1,
	1.5,
	2,
	2.5,
	3,
	3.5,
	4,
	4.5,
	5
]

const NUMBEROFQUESTIONS = 10;

class PoneQuiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gameState: GameStates.START,
			curMode: GameModes.TWENTYQ,
			curQuote: {},
			curDifficulty: 1,
			curScore: 0,
			prevScore: 0,
			curQuestionCount: 0,
			curWrongCount: 0,
			curStreak: 0,
			curHistory: [],
			guess: "",
			highScore: null,
		}
		this.checkAnswer = this.checkAnswer.bind(this);
		this.startGame = this.startGame.bind(this);
		this.findQuote = this.findQuote.bind(this);
		this.finishGame = this.finishGame.bind(this);
	}

	setGameState(newState) {
		this.setState({
			...this.state,
			gameState: newState,
		});
	}

	getMultiplier() {
		if (this.state.curStreak < Multipliers.length) {
			return Multipliers[this.state.curStreak];
		} else {
			return Multipliers[Multipliers.length - 1]
		}
	}

	startGame() {
		this.setState({
			...this.state,
			curDifficulty: 1,
			curScore: 0,
			prevScore: 0,
			curQuestionCount: 0,
			curWrongCount: 0,
			curStreak: 0,
			curHistory: [],
			guess: "",
		}, () => this.findQuote(1));
	}

	findQuote(difficulty) {
		let newQuestionCount = this.state.curQuestionCount + 1;
		let difString = Difficulties[difficulty];
		let lineCount = gameData.count_by_difficulty[difString];
		let quoteIndex = Math.floor(Math.random() * lineCount);
		let fetchedQuote = gameData.lines_by_difficulty[difString][quoteIndex];
		console.log(fetchedQuote);
		this.setState({
			...this.state,
			curQuote: fetchedQuote,
			curDifficulty: difficulty,
			curQuestionCount: newQuestionCount,
			prevScore: this.state.curScore,
			guess: "",
			gameState: GameStates.QUESTION,
		});

	}

	setGuess(guess) {
		this.setState({
			...this.state,
			guess: guess,
		});
	}

	checkAnswer(e) {
		e.preventDefault();

		let lowerGuess = this.state.guess.toLowerCase();
		let lowerAnswer = this.state.curQuote.title.toLowerCase();

		if (lowerGuess === lowerAnswer) {
			let newScore = this.state.curScore + PointValues[this.state.curDifficulty] * this.getMultiplier();

			this.setState({
				...this.state,
				curScore: newScore,
				curStreak: this.state.curStreak + 1,
				curHistory: [...this.state.curHistory, {difficulty: this.state.curDifficulty, correct: true}],
				gameState: GameStates.CORRECT,
			});
		} else {
			this.setState({
				...this.state,
				curStreak: 0,
				curWrongCount: this.state.curWrongCount + 1,
				curHistory: [...this.state.curHistory, {difficulty: this.state.curDifficulty, correct: false}],
				gameState: GameStates.INCORRECT,
			});
		}
	}

	setDifficulty(difMod) {
		let newDifficulty = this.state.curDifficulty + difMod;
		if (newDifficulty < 0) {
			newDifficulty = 0;
		} else if (newDifficulty > Difficulties.length - 1) {
			newDifficulty = Difficulties.length - 1;
		}
		this.setState({
			...this.state,
			curDifficulty: newDifficulty,
		});
		this.findQuote(newDifficulty);
	}

	finishGame() {
		let newHS = this.state.highScore
		if (this.state.highScore === null || this.state.curScore >= this.state.highScore.score) {
			newHS = {
				score: this.state.curScore,
				dateSet: Date.now(),
			}
			localStorage.setItem('quiz-high-score', JSON.stringify(newHS));
		}
		this.setState({
			...this.state,
			gameState: GameStates.FINISHED,
			highScore: newHS,
		});
	}

	componentDidMount() {
		let storedHighScore = localStorage.getItem('quiz-high-score');
		if (storedHighScore !== null) {
			try {
				storedHighScore = JSON.parse(storedHighScore);
			} catch {
				storedHighScore = null;
			}
			
		}
		console.log(storedHighScore);
		this.setState({
			...this.state,
			highScore: storedHighScore
		});
  	}

	render() {
		let content;
		switch(this.state.gameState) {
			case GameStates.START:
				content = (<div className="start">
					<h4><i>The PonePonePone Quote Quiz!</i></h4>
					<p>We'll give you <b>ten quotes</b> from My Little Pony: Friendship is Magic. Your job is to <b>identify what episode each one is from.</b></p>
					<p>After each successful guess, <b>you'll be given the choice to make the next question harder, easier, or the same difficulty.</b> Harder questions are worth <b>more points,</b> but they may be trickier! If you get a question wrong, you'll be dropped down a difficulty level. Additionally, you'll <b>earn more points if you answer multiple questions correctly in a row</b>. Try to earn as many points as you can before you run out of questions!</p>
					<button onClick={this.startGame}>Start!</button>
				</div>
				);
				break;

			case GameStates.QUESTION:
				let multiplierSpan;
				let multiplier = this.getMultiplier();
				if (multiplier > 1) {
					multiplierSpan = (<span>x{multiplier}</span>);
				}
				content = (
					<div className="question">
						<ScoreDisplay score={this.state.curScore} prevScore={this.state.prevScore} streak={this.state.curStreak} />
						<div className="quote-box">
							<p>Quote #{this.state.curQuestionCount}</p>
							<p>Difficulty: {PrettyDifficulties[this.state.curDifficulty]}</p>
							<h5>For {PointValues[this.state.curDifficulty]} {multiplierSpan} points:</h5>
							<h4>{this.state.curQuote.line}</h4>
						</div>
						<form onSubmit={this.checkAnswer}>
		  					<input list="episodes" onInput={e => this.setGuess(e.target.value)} value={this.state.guess} autoFocus/>
							<datalist id="episodes">
								{
									gameData.episode_titles.map((title, index) => (
										<option key={index} value={title}/>
									))
								}
							</datalist>
							<button type="submit" title="Search!">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-question-square-fill" viewBox="0 0 16 16">
									<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/>
								</svg>
							</button>
		  				</form>
	  				</div>
				);
				break;

			case GameStates.CORRECT: {
				let endButton;
				if (this.state.curQuestionCount === NUMBEROFQUESTIONS) {
					endButton = (
						<button onClick={this.finishGame} title="Finish Game">Finish Game</button>
					);
				} else {
					endButton = (
						<button onClick={()=>this.setGameState(GameStates.BETWEEN_QUESTION)} title="Next">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-fast-forward-btn-fill" viewBox="0 0 16 16">
								<path d="M0 4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2m4.271 1.055a.5.5 0 0 1 .52.038L8 7.386V5.5a.5.5 0 0 1 .79-.407l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 8 10.5V8.614l-3.21 2.293A.5.5 0 0 1 4 10.5v-5a.5.5 0 0 1 .271-.445"/>
							</svg>
						</button>
					);
				}
				content = (
					<div className="result">
						<ScoreDisplay score={this.state.curScore} prevScore={this.state.prevScore} streak={this.state.curStreak} />
						<h4>Correct!</h4>
						<p>You got it right!</p>
						{endButton}
					</div>
				);
				break;
			}

			case GameStates.INCORRECT: {
				let seNum;
				if (this.state.curQuote.season !== 0) {
					seNum = (<span>S{this.state.curQuote.season} E{this.state.curQuote.number_in_season} </span>)
				}
				let failString = "The next question will be easier.";
				if (this.state.curDifficulty === 0) {
					failString = "The next question will be the same difficulty.";
				}
				let endButton;
				if (this.state.curQuestionCount === NUMBEROFQUESTIONS) {
					endButton = (
						<button onClick={this.finishGame} title="Finish Game">Finish Game</button>
					);
				} else {
					endButton = (
						<button onClick={()=>this.setDifficulty(-1)} title="Next">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-fast-forward-btn-fill" viewBox="0 0 16 16">
								<path d="M0 4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2m4.271 1.055a.5.5 0 0 1 .52.038L8 7.386V5.5a.5.5 0 0 1 .79-.407l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 8 10.5V8.614l-3.21 2.293A.5.5 0 0 1 4 10.5v-5a.5.5 0 0 1 .271-.445"/>
							</svg>
						</button>
					);
				}
				content = (
					<div className="result">
						<ScoreDisplay score={this.state.curScore} prevScore={this.state.prevScore} streak={this.state.curStreak} />
						<h4>Incorrect...</h4>
						<p>You said {this.state.guess}.</p>
						<p>The correct answer was <b>{seNum}{this.state.curQuote.title}</b>.</p>
						<p>{failString}</p>
						{endButton}
					</div>
				);
				break;
			}

			case GameStates.BETWEEN_QUESTION:
				content = (
					<div className="difficulty-select">
						<ScoreDisplay score={this.state.curScore} prevScore={this.state.prevScore} streak={this.state.curStreak} />
						<h4>Pick your poison!</h4>
						<p>That last question was {PrettyDifficulties[this.state.curDifficulty].toLowerCase()}. The next question should be...</p>
						<button onClick={()=>this.setDifficulty(-1)} disabled={this.state.curDifficulty === 0}>Easier!</button>
						<button onClick={()=>this.setDifficulty(0)}>The Same!</button>
						<button onClick={()=>this.setDifficulty(1)} disabled={this.state.curDifficulty === 4}>Harder!</button>
					</div>
				);
				break;

			case GameStates.FINISHED:
				content = (
					<div className="finish-screen">
						<h3>All done!</h3>
						<h4>Your score that round was:</h4>
						<h1>{this.state.curScore} Points!</h1>
						<h4>Your High Score: {this.state.highScore.score} | <small>{new Date(this.state.highScore.dateSet).toLocaleString()}</small></h4>
						<button onClick={this.startGame}>Play Again</button>
						<p>You got {this.state.curWrongCount} wrong.{this.state.curWrongCount === 0 ? " A perfect game!" : ""}</p>
						<ol className="final-tally">
							{
								this.state.curHistory.map((entry, index) => (
									<li key={index}>{PrettyDifficulties[entry.difficulty]} | {entry.correct ? "Correct" : "Incorrect"}</li>
								))
							}
						</ol>
					</div>
				);
				break;

			default:
				content = (
					<div className="error">
						<p>Something went wrong! Try refreshing the page.</p>
					</div>
				);
				break;
		}

  		return(
  			<div className="pone-guessr page">
  				<Helmet>
					<title>Pone Pone Don't Tell Me | PonePonePone - MLP: FiM Transcript Search</title>
					<meta name="description" content="Test your knowledge of MLP: FiM with this quote guessing game!" />
				</Helmet>
  				<hr/>
  				<h2>Pone Pone Don't Tell Me</h2>

  				{content}
  				
  			</div>
  		);
	}
}

export default PoneQuiz;