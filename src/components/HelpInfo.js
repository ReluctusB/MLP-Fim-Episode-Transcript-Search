import React, { Component } from 'react';

class HelpInfo extends Component {
	constructor(props) {
		super(props);
	}

	render() {
  		return(
  			<div className="help-info">
  				<hr/>
  				<h2>Search Parameters</h2>
  				<p>You can refine your search by using special search parameters. Search parameters are denoted by curly brackets: &#123; &#125;. These can be combined with regular searches and each other.</p>

  				<h3>Character</h3>
  				<p>You can search by character using &#123;character: character name&#125;. For example, to search for lines said by Rainbow Dash, you would search &#123;character: Rainbow Dash&#125;. You can also click on a character's name to search their lines.</p>

  				<h3>Episode</h3>
  				<p>You can search by episode title using &#123;episode: episode name&#125;. For example, to search for lines in Fall Weather Friends, you would search &#123;episode: Fall Weather Friends&#125;. You can also click on an episode title to search its lines.</p>

  				<h3>Combining Search Parameters</h3>
  				<p>Parameters can be combined and added to normal searches. For example, the search "&#123;episode: Fall Weather Friends&#125; &#123;character: Rainbow Dash&#125; Applejack" will return all lines in Fall Weather Friends spoken by Rainbow Dash containing the word "Applejack".</p>

  				<hr/>

  				<h2>Regular Expressions</h2>
  				<p>All search fields (including parameters) support Regular Expressions. Regular Expressions are a powerful way to search through text. You can learn more about them <a href="https://www.regular-expressions.info/">here</a>.</p>
  				<p>As an example, if you wanted to search for "Tom" and only "Tom" without returning results for "Tomorrow", you could search for "\bTom\b".</p>

  				<hr/>

  				<h2>Corpus</h2>
  				<h3>What's in here:</h3>
  				<ul>
  					<li>Every episode of My Little Pony: Friendship is Magic</li>
  					<li>My Little Pony: The Movie</li>
  					<li>My Little Pony: Rainbow Roadtrip</li>
  					<li>My Little Pony: Best Gift Ever</li>
  					<li>Gen 4 Animated Shorts</li>
  				</ul>

  				<h3>What isn't in here:</h3>
  				<ul>
  					<li>Anything Equestria Girls</li>
  					<li>Pony Life</li>
  					<li>Anything that isn't Gen 4</li>
  				</ul>

  				<hr/>

  				<h2>About</h2>
  				<p>This tool was created by RB. Their Fimfiction can be found <a href="https://www.fimfiction.net/user/34408/RB_">here</a>, if you need to bug them about something. Alternatively, if you find something is amiss with this site in particular, you can open an issue <a href="https://github.com/ReluctusB/MLP-Fim-Episode-Transcript-Search/issues">here</a>!</p>
  				<p>If you like this tool, <a href="https://ko-fi.com/rbunderscore">consider leaving a tip</a>!</p>


  			</div>
  		);
	}
}

export default HelpInfo;