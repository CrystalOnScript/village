import React, { Component } from 'react';
import LogoTran from '../villagetwo.png'

class Nav extends Component {



  render() {
    return (
      <div>
        <nav>
          <div className="nav-wrapper #80deea cyan lighten-3">
            <a href="#" className="brand-logo center"><img src={LogoTran} className="navLogo" alt="logo" /></a>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
              <li><a href="sass.html">Sass</a></li>
              <li><a href="badges.html">Components</a></li>
              <li><a href="collapsible.html">JavaScript</a></li>
            </ul>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a onClick={this.props.logout} className="hide" id="logoutButton">Logout</a></li>
              <li><a onClick={this.props.login} id="googleBtn">Login</a></li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Nav;
