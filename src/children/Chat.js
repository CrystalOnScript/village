import React, { Component } from 'react';
import firebase from 'firebase';


class Chat extends Component {

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
      messages: [],
    };
    firebase.database().ref('testvillage/messages').on('value', function(snapshot){
       let self = this
       let messages = [ ]
        if(snapshot.val() != null){
          snapshot.forEach(function(childSnapshot) {
          console.log(childSnapshot.val())
          messages.push(childSnapshot.val())
          })
          self.setState({messages: messages})
          console.log(self.state.messages)
        }else{
          console.log('no messages yet')
        }

      }.bind(this));
    this.writeChat = this.writeChat.bind(this);
    this.chatChange = this.chatChange.bind(this);
  }





  render(){

    return(
      <div className="messageCom">

        <br />
            <div className="messagesList scroll">
               {this.state.messages.map(function(each){
                      return <div>
                        <hr />
                        <p>{each.username}: <br />{each.chat}</p>
                      <hr /></div>;
               })}
             </div>

          <input value={this.state.chat} onChange={this.chatChange}></input>
          <br />
          <button onClick={this.writeChat}>Message</button>
      </div>
    );
  }
}

export default Chat;
