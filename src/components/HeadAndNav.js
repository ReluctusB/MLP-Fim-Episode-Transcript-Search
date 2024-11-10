import React, { Component } from 'react';

import StyleSwitch from "./StyleSwitch";
import logo from "../assets/PonePonePoneLogo.svg";

class HeadAndNav extends Component {
  render() {
    return(
      <header className="App-header">
        <nav>
          <a href="/" title="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search-heart-fill" viewBox="0 0 16 16">
              <path d="M6.5 13a6.47 6.47 0 0 0 3.845-1.258h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1A6.47 6.47 0 0 0 13 6.5 6.5 6.5 0 0 0 6.5 0a6.5 6.5 0 1 0 0 13m0-8.518c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018"/>
            </svg>
          </a> | <a href="?page=pone_quiz" title="Pone Pone Don't Tell Me">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-joystick" viewBox="0 0 16 16">
              <path d="M10 2a2 2 0 0 1-1.5 1.937v5.087c.863.083 1.5.377 1.5.726 0 .414-.895.75-2 .75s-2-.336-2-.75c0-.35.637-.643 1.5-.726V3.937A2 2 0 1 1 10 2"/>
              <path d="M0 9.665v1.717a1 1 0 0 0 .553.894l6.553 3.277a2 2 0 0 0 1.788 0l6.553-3.277a1 1 0 0 0 .553-.894V9.665c0-.1-.06-.19-.152-.23L9.5 6.715v.993l5.227 2.178a.125.125 0 0 1 .001.23l-5.94 2.546a2 2 0 0 1-1.576 0l-5.94-2.546a.125.125 0 0 1 .001-.23L6.5 7.708l-.013-.988L.152 9.435a.25.25 0 0 0-.152.23"/>
            </svg>
          </a> | <a href="?page=help" title="Help & Info">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-info-square-fill" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
          </a> | <StyleSwitch/>
        </nav>
        <div className="site-name">
          <a href="/">
          <img className="logo" src={logo} alt="Logo" width="500" height="500"/>
          <div className="site-title">
            <h1>PonePonePone</h1>
            <h4>MLP: FiM Transcript Search</h4>
          </div>
          </a>
        </div>
      </header>
    );
  }
}

export default HeadAndNav;