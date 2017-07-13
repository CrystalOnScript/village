import React, { Component } from 'react';
import LogoTran from '../villagetwo.png'
import HelpLogo from '../helpMe.png'
class Nav extends Component {



  render() {
    return (
      <div>
        <nav>
          <div className="nav-wrapper #80deea cyan lighten-3">
            <a href="index.html" className="brand-logo center" onClick={this.goHome}><img src={LogoTran} className="navLogo" alt="logo" /></a>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
              <li><a onClick={this.props.activeCreate}>Create Village</a></li>
              <li><a href="badges.html">Join Village</a></li>
            </ul>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a onClick={this.props.logout} className="hide" id="logoutButton">Logout</a></li>
              <li><a onClick={this.props.login} id="googleBtn">Login</a></li>
            </ul>
          </div>
        </nav>
        <br />
        <div id="landingDiv">
          <h4 className="logoFont">Make One, Join One, Takes One.</h4>
          <img src={HelpLogo} alt="helplogo" id="helpLogo"/>
        </div>

      </div>
    );
  }
}

export default Nav;
