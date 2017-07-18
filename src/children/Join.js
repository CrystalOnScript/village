import React, { Component } from 'react';
import firebase from 'firebase';

class Join extends Component {

  joinVillage(event){
    console.log(event.target.value)
    let key = event.target.value
    const user = firebase.auth().currentUser;
    let self = this;
    firebase.database().ref("users/"+ user.uid).once("value", function(snapshot){
      let userToken = snapshot.val().token
        self.setState({ userToken: userToken })

    }).then(()=>{

      firebase.database().ref('village-users/'+key +"/" + user.uid).set({
          email: user.email,
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
    firebase.database().ref('villages').on('value', function(snapshot){
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
            name: childSnapshot.val().villageName
          }
          villages.push(currentVillage)
          })
          self.setState({villages: villages})
          console.log(self.state.villages)
        }else{
          console.log('no villages yet')
        }

      }.bind(this));
    this.joinVillage = this.joinVillage.bind(this);
  }


  render() {
    return (
      <div className="hide" id="joinDiv">
        <div >
           {this.state.villages.map( (each) => {

           return <div key={each.key}>
                    <p>{each.name}</p>
                    <button value={each.key} key={each.key} onClick={this.joinVillage} className="waves-effect waves-light btn #fbc02d yellow darken-2">Join</button>
                </div>;
           })}
         </div>

      </div>
    );
  }
}

export default Join;
