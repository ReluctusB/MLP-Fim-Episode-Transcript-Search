import React from 'react';
import Router from  "./components/Router";
import StyleSwitch from "./components/StyleSwitch";
import ToTop from "./components/ToTop";
import './scss/index.scss';


function App() {
  return (
    <div className="App">
      <div className="manebar left"></div>
      <div className="manebar right"></div>
      <header className="App-header">
        
        <aside>
          <a href="/MLP-Fim-Episode-Transcript-Search/help" title="Help">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-info-square-fill" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg></a> | <StyleSwitch/>
        </aside>
        <h1><a href="/MLP-Fim-Episode-Transcript-Search">MLP: FiM Transcript Search</a></h1>
      </header>
      <Router />
      
      <footer>
        <hr/>
        <p>MLP: Friendship is Magic® - © Hasbro Inc.®</p>
        <p>Created by RB_ | <a href="https://github.com/ReluctusB/MLP-Fim-Episode-Transcript-Search">Github</a> | <a href="https://ko-fi.com/rbunderscore">Like this tool? Consider tipping!</a></p>
      </footer>

      <ToTop />
    </div>
  );
}

export default App;