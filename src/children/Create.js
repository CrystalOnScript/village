import React, { Component } from 'react';
import firebase from 'firebase';

class Create extends Component {

  createVillage(event) {
      event.preventDefault()
          let self = this;
      const user = firebase.auth().currentUser;

      if(user === null){
        self.setState({ successfulCreate: "You must be logged in to create a village."})
      }else{

        const user = firebase.auth().currentUser;
        let villageName = this.state.villageName
        firebase.database().ref("users/"+ user.uid).once("value", function(snapshot){
          let userToken = snapshot.val().token
            self.setState({ userToken: userToken })

        }).then(function(){
          console.log(villageName)
          console.log(self.state.userToken)
          // TODO test this data with subbing to villages
          let villageData = {
            villageName: villageName,
            villageRuler: user.uid,
            subscribedUsers: {
              user: {
                userId: user.uid,
                token: self.state.userToken
              }
            }
          }

          const villageRef = firebase.database().ref("villages/");

          villageRef.push(villageData)
          let newName = self.state.villageName
          self.setState({
            successfulCreate: "Thanks! You created village " +newName,
            villageName: ' '
           })
        })

    }


    }

  nameChange(event){
    this.setState({ villageName: event.target.value })
  }


  constructor(props){
    super(props);

    this.state = {
      villageName: ' ',
      userToken: ' ',
      successfulCreate: ' ',
    };

    this.createVillage = this.createVillage.bind(this);
    this.nameChange = this.nameChange.bind(this);
  }



  render() {
    return (
      <div id="createDiv" className="hide messageCom">
        <p>{this.state.successfulCreate}</p>
        <form onSubmit={this.createVillage}>
          <p className="center-align">Village Name</p>
          <input value={this.state.villageName} onChange={this.nameChange} className="inputBar"></input>
          <br />
          <button type="submit" className="waves-effect waves-light btn #fbc02d yellow darken-2">Create Village</button>
        </form>
      </div>
    );
  }
}

export default Create;
