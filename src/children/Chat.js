import React, { Component } from 'react';
import firebase from 'firebase';


class Chat extends Component {

  componentDidUpdate(){
    const user = firebase.auth().currentUser;
    let messages = firebase.database().ref("testvillage/messages");
    messages.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        var chatBox = document.getElementById("chatBox")
        console.log(item.username)
        console.log(item.chat);
        chatBox.append(item.chat)
        chatBox.append(item.username)
        })
    });
  }
  logUser(){
    const user = firebase.auth().currentUser;
    console.log(user)
  }

  writeChat() {
      var self = this;
      const user = firebase.auth().currentUser;

      var messageData = {
        chat: this.state.chat,
        username: user.displayName,
      };

      // Get a key for a new Post.
      let newMessageKey = firebase.database().ref("testvillage").child("message").push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      let updates = {};
      updates['/messages/' + newMessageKey] = messageData;

      return firebase.database().ref("testvillage/").update(updates).then(function(){
        self.setState({ chat: " " })
        console.log(self.state.chat)
      })


    }

  chatChange(event){
    this.setState({ chat: event.target.value })
    console.log(this.state.chat)
  }

  constructor(props){
    super(props);

    this.state = {
      chat: ' ',
    };
    this.logUser = this.logUser.bind(this);
    this.writeChat = this.writeChat.bind(this);
    this.chatChange = this.chatChange.bind(this);
  }





  render(){
    return(
      <div>
        <button onClick={this.logUser}>click</button>
        <br />
          <div id="chatBox">

          </div>
          <input value={this.state.chat} onChange={this.chatChange}></input>
          <br />
          <button onClick={this.writeChat}>Message</button>

      </div>
    );
  }
}

export default Chat;
