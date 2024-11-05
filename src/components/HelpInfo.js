import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

class HelpInfo extends Component {
	render() {
  		return(
  			<div className="help-info page">
  				<Helmet>
					<title>Help & Info | PonePonePone - MLP: FiM Transcript Search</title>
				</Helmet>
  				<hr/>
  				<h2>Search Parameters</h2>
  				<p>You can refine your search by using special search parameters. Search parameters are denoted by curly brackets: <code>&#123; &#125;</code>. These can be combined with regular searches and each other.</p>

  				<h3>Character</h3>
  				<p>You can search by character using <code>&#123;character: character name&#125;</code>. For example, to search for lines said by Rainbow Dash, you would search <code>&#123;character: Rainbow Dash&#125;</code>. You can also click on a character's name to search their lines.</p>

  				<h3>Episode</h3>
  				<p>You can search by episode title using <code>&#123;episode: episode name&#125;</code>. For example, to search for lines in Fall Weather Friends, you would search <code>&#123;episode: Fall Weather Friends&#125;</code>. You can also click on an episode title to search its lines.</p>

  				<h3>Combining Search Parameters</h3>
  				<p>Parameters can be combined and added to normal searches. For example, the search <code>&#123;episode: Fall Weather Friends&#125; &#123;character: Rainbow Dash&#125; Applejack</code> will return all lines in Fall Weather Friends spoken by Rainbow Dash containing the word "Applejack".</p>

  				<hr/>

  				<h2 id="regex">Regular Expressions</h2>
  				<p>All search fields (including parameters) support Regular Expressions. Regular Expressions are a powerful way to search through text. You can learn more about them <a href="https://www.regular-expressions.info/">here</a>.</p>
  				<p>As an example, if you wanted to search for "Tom" and only "Tom" without returning results for "Tomorrow", you could search for <code>\bTom\b</code>.</p>
				<p>However, because the ability to search for a specific word is a common use-case of this tool, you can also use double quotes in place of <code>\b</code>. The end result is exactly the same. If you actually want to search <i>for</i> double quotes, you can escape them with a backslash: <code>\"</code></p>
				<p>If you are getting a "Regular expression was malformed" error, it means that whatever you've entered into the specified search field is an invalid regular expression. This usually means that you have an extra or unpaired parenthesis or bracket somewhere. Please note that if you are trying to search for parentheses or brackets or any other special regular expression character, you will need to escape them by putting a backslash in front of them, like so: <code>\(</code></p>

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