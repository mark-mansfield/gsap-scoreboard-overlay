import React, { Component } from 'react';
import { render } from 'react-dom';
import StateControl from "./state-control.js";
import './style.css';

class App extends Component {

  render() {
    return (
      <div>
        <StateControl />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
