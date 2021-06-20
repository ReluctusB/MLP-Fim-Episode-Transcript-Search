import React, { Component } from 'react';
import SearchBar from "./components/SearchBar";
import './scss/index.scss';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MLP: FiM Episode Transcript Search</h1>
      </header>
      <SearchBar/>
    </div>
  );
}

export default App;
