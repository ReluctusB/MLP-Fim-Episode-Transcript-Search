import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import ScoreDisplay from "./ScoreDisplay";
import ResultsHistory from "./ResultsHistory";
import LoadingIcon from "./LoadingIcon";

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
	TENQ: 0,
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
			curMode: GameModes.TENQ,
			curQuote: {},
			curDifficulty: 1,
			curScore: 0,
			prevScore: 0,
			curQuestionCount: 0,
			curWrongCount: 0,
			curRightCount: 0,
			curStreak: 0,
			curHistory: [],
			guess: "",
			highScore: null,
			loading: false,
		}
		this.gameData = null;
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
			curRightCount: 0,
			curStreak: 0,
			curHistory: [],
			guess: "",
			loading: true,
		}, () => this.findQuote(1));
	}

	async findQuote(difficulty) {
		if (this.gameData === null) {
			this.gameData = await import("../assets/game_tf_idf.json");
		}

		let newQuestionCount = this.state.curQuestionCount + 1;
		let difString = Difficulties[difficulty];
		let lineCount = this.gameData.count_by_difficulty[difString];
		let quoteIndex = Math.floor(Math.random() * lineCount);
		let fetchedQuote = this.gameData.lines_by_difficulty[difString][quoteIndex];
		//console.log(fetchedQuote);
		this.setState({
			...this.state,
			curQuote: fetchedQuote,
			curDifficulty: difficulty,
			curQuestionCount: newQuestionCount,
			prevScore: this.state.curScore,
			guess: "",
			gameState: GameStates.QUESTION,
			loading: false,
		});

	}

	setGuess(guess) {
		let adjInString = guess
  			.replace(/[\u2018\u2019\u0027]/g, "'")
  			.replace(/[\u201C\u201D]/g, '"');
		this.setState({
			...this.state,
			guess: adjInString,
		});
	}

	checkAnswer(e) {
		e.preventDefault();

		let lowerGuess = this.state.guess.toLowerCase().trim();
		let lowerAnswer = this.state.curQuote.title.toLowerCase();

		if (lowerGuess === lowerAnswer) {
			let newScore = this.state.curScore + PointValues[this.state.curDifficulty] * this.getMultiplier();

			this.setState({
				...this.state,
				curScore: newScore,
				curStreak: this.state.curStreak + 1,
				curRightCount: this.state.curRightCount + 1,
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
						<ScoreDisplay score={this.state.curScore} questionNumber={this.state.curQuestionCount} prevScore={this.state.prevScore} streak={this.state.curStreak} />
						<div className="quote-box">
							<p>{PrettyDifficulties[this.state.curDifficulty]} Question</p>
							<h5>For {PointValues[this.state.curDifficulty]} {multiplierSpan} points:</h5>
							<h4>{this.state.curQuote.line}</h4>
						</div>
						<form onSubmit={this.checkAnswer}>
		  					<input type="text" list="episodes" placeholder="The episode is..." onInput={e => this.setGuess(e.target.value)} value={this.state.guess} autoFocus/>
							<datalist id="episodes">
								{
									this.gameData.episode_titles.map((title, index) => (
										<option key={index} value={title}/>
									))
								}
							</datalist>
							<button type="submit" title="Guess!">
								Guess!
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
							Next
						</button>
					);
				}
				content = (
					<div className="result">
						<ScoreDisplay score={this.state.curScore} questionNumber={this.state.curQuestionCount} prevScore={this.state.prevScore} streak={this.state.curStreak} />
						<h2>Correct!</h2>
						<p>You got it right!</p>
						{endButton}
					</div>
				);
				break;
			}

			case GameStates.INCORRECT: {
				let seNum;
				if (this.state.curQuote.season !== 0) {
					seNum = (<span> (S{this.state.curQuote.season} E{this.state.curQuote.number_in_season})</span>)
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
							Next
						</button>
					);
				}
				content = (
					<div className="result">
						<ScoreDisplay score={this.state.curScore} questionNumber={this.state.curQuestionCount} prevScore={this.state.prevScore} streak={this.state.curStreak} />
						<h2>Incorrect...</h2>
						<p>You said "{this.state.guess.trim()}".</p>
						<p>The correct answer was <b>{this.state.curQuote.title}</b>{seNum}.</p>
						<p>{failString}</p>
						{endButton}
					</div>
				);
				break;
			}

			case GameStates.BETWEEN_QUESTION:
				content = (
					<div className="difficulty-select">
						<ScoreDisplay score={this.state.curScore} questionNumber={this.state.curQuestionCount} prevScore={this.state.prevScore} streak={this.state.curStreak} />
						<h2>Pick your poison!</h2>
						<p>That last question was {PrettyDifficulties[this.state.curDifficulty].toLowerCase()}. The next question should be...</p>
						<div className="button-group">
							<button onClick={()=>this.setDifficulty(-1)} disabled={this.state.curDifficulty === 0}>Easier!</button>
							<button onClick={()=>this.setDifficulty(0)}>The Same!</button>
							<button onClick={()=>this.setDifficulty(1)} disabled={this.state.curDifficulty === 4}>Harder!</button>
						</div>
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
						
						<ResultsHistory history={this.state.curHistory} wrongCount={this.state.curWrongCount} rightCount={this.state.curRightCount} />
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
  			<div className="pone-quiz page">
  				<Helmet>
					<title>Pone Pone Don't Tell Me! | PonePonePone - MLP: FiM Transcript Search</title>
					<meta name="description" content="Test your knowledge of MLP: FiM with this quote guessing game!" />
				</Helmet>
  				<hr/>
  				<h1>Pone Pone Don't Tell Me!</h1>
  				<h4><i>The PonePonePone Quote Quiz</i></h4>
  				<hr />

  				{content}
  				{this.state.loading ? (<LoadingIcon />) : null}
  			</div>
  		);
	}
}

export default PoneQuiz;