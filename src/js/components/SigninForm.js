import React, {Component} from 'react';
import {connect} from 'react-redux';
import {signInUser} from '../actions';
import Client from '../client/client';

class SigninForm extends Component {
  constructor(props){
    super(props);
    this.state = { showConfirm: false };
  }

  render() {
      if (this.state.showConfirm) {
        return (
            <div>
                <h1>Login</h1>
                <input id="username" type="text" placeholder="username" />
                <br />
                <input id="password" type="text" placeholder="password" />
                <br />
                <input id="confirm" type="text" placeholder="confirm password" />
                <br />
                <button onClick={() => this.loginClick()}>Login</button>
                <button onClick={() => this.signUpClick()}>Sign-Up</button>
            </div>
        );
      }

      return (
          <div>
              <h1>Login</h1>
              <input id="username" type="text" placeholder="username" />
              <br />
              <input id="password" type="text" placeholder="password" />
              <br />
              <button onClick={() => this.loginClick()}>Login</button>
              <button onClick={() => this.signUpClick()}>Sign-Up</button>
          </div>
      );
  }

  loginClick() {
    if (this.state.showConfirm) {
      this.setState({
        showConfirm: false
      });
      return;
    }

    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");

    // Check if fields are empty.
    if (usernameInput.value == "" || passwordInput.value == "") {
      alert("Fields can't be empty.");
      return;
    }

    // Login.
    Client.get("users/login",
      { username: usernameInput.value, password: passwordInput.value },
      function (response) {
        this.props.signInUser(response.user);
      }.bind(this),
      function (error) {
        alert("error: " + error);
      }
    );
  }

  signUpClick() {
    // Show confirmation input.
    if (!this.state.showConfirm) {
      this.setState({
        showConfirm: true
      });
      return;
    }

    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var confirmInput = document.getElementById("confirm");

    // Check if fields are empty.
    if (usernameInput.value == "" || passwordInput.value == "" || confirmInput.value == "") {
      alert("Fields can't be empty.");
      return;
    }

    // Check if password and confirm match.
    if (passwordInput.value != confirmInput.value) {
      alert("Your password and confirmation don't match.");
      return;
    }

    // Sign up.
    Client.post("users/",
      { username: usernameInput.value, password: passwordInput.value },
      function (response) {
        this.props.signInUser(response.user);
      }.bind(this),
      function (error) {
        alert("error: " + error);
      }
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signInUser: (user) => {
      dispatch(signInUser(user))
    }
  };
}

export default connect(null, mapDispatchToProps)(SigninForm);
