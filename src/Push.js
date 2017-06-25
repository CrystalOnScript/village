import React, { Component } from 'react';


class Push extends Component {



    cLogMe(){
    console.log("I am here")
  }

  componentWillMount(){

    // askPermission();

  };

  constructor(props){
    super(props);

    this.state = {};

    this.cLogMe = this.cLogMe.bind(this);
    // this.askPermission = this.askPermission.bind(this);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">

          <h2>Push</h2>

          <button onClick={this.cLogMe}>Log Me</button>
        </div>

      </div>
    );
  }
}

export default Push;
