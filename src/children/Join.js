import React, { Component } from 'react';
import firebase from 'firebase';

class Join extends Component {

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

  joinVillage(event){
    console.log(event.target.value)
    let key = event.target.value
    const user = firebase.auth().currentUser;
    let self = this;
    firebase.database().ref("users/"+ user.uid).once("value", function(snapshot){
      let userToken = snapshot.val().token
        self.setState({ userToken: userToken })

    }).then(()=>{

      firebase.database().ref('villages/'+key +"/village/subscribedUsers").push({
          userId: user.uid,
          token: self.state.userToken
      })

    })

  }



  constructor(props){
    super(props);

    this.state = {
      villages: [],
      userToken: '',
    };
    firebase.database().ref('villages').once('value', function(snapshot){
       let self = this
       let villages = [ ]
        if(snapshot.val() != null){
          console.log(snapshot.val())
          // villages.push(snapshot.val())
          snapshot.forEach(function(childSnapshot) {
          console.log(childSnapshot.val())
          console.log(childSnapshot.key)
          let currentVillage = {
            key: childSnapshot.key,
            name: childSnapshot.val().village.villageName
          }
          villages.push(currentVillage)
          })
          self.setState({villages: villages})
          console.log(self.state.villages)
        }else{
          console.log('no villages yet')
        }

      }.bind(this));
    this.createVillage = this.createVillage.bind(this);
    this.joinVillage = this.joinVillage.bind(this);
  }


  render() {
    return (
      <div>
        Hi there, join here!
        <div>
           {this.state.villages.map( (each) => {

           return <div>
                    <p>{each.name}</p>
                    <button value={each.key} onClick={this.joinVillage} className="waves-effect waves-light btn #fbc02d yellow darken-2">Join</button>
                </div>;
           })}
         </div>

      </div>
    );
  }
}

export default Join;