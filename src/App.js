import React, { Component } from 'react';
import logo from './vilagelogo.png';
import './App.css';
import Login from './Login';
import Push from './Push';



class App extends Component {


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Help Me Herald</h2>
        </div>
        <Login />
        <Push />
      </div>
    );
  }
}

export default App;
