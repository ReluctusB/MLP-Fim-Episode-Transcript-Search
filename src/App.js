import React from 'react';
import SearchBar from "./components/SearchBar";
import './scss/index.scss';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MLP: FiM Episode Transcript Search</h1>
      </header>
      <SearchBar/>
      <footer>
        <hr/>
        <p>MLP: Friendship is Magic® - © Hasbro Inc.®</p>
        <p>Created by RB_ | <a href="https://github.com/ReluctusB/MLP-Fim-Episode-Transcript-Search">Github</a></p>
      </footer>
    </div>
  );
}

export default App;
