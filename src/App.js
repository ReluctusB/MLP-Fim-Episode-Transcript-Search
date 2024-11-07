import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

import HeadAndNav from  "./components/HeadAndNav";
import Router from  "./components/Router";
import ToTop from "./components/ToTop";
import CopyNotif from "./components/CopyNotif";
import './scss/index.scss';


function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <div className="manebar left"></div>
        <div className="manebar right"></div>
        <HeadAndNav />

        <Router />
        
        <footer>
          <hr/>
          <p>MLP: Friendship is Magic® - © Hasbro Inc.®</p>
          <p>Created by RB_ | <a href="https://github.com/ReluctusB/MLP-Fim-Episode-Transcript-Search">Github</a> | <a href="https://ko-fi.com/rbunderscore">Like this tool? Consider tipping!</a></p>
        </footer>

        <ToTop />
        <CopyNotif />
      </div>
    </HelmetProvider>
  );
}

export default App;