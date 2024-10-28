import React from 'react';
import SearchBar from "./components/SearchBar";
import StyleSwitch from "./components/StyleSwitch";
import './scss/index.scss';


function App() {
  return (
    <div className="App">
      <div id="Manebar"></div>
      <header className="App-header">
        <h1>MLP: FiM Episode Transcript Search</h1>
      </header>
      <SearchBar/>
      <StyleSwitch/>
      <footer>
        <hr/>
        <p>MLP: Friendship is Magic® - © Hasbro Inc.®</p>
        <p>Created by RB_ | <a href="https://github.com/ReluctusB/MLP-Fim-Episode-Transcript-Search">Github</a></p>
      </footer>
    </div>
  );
}

export default App;