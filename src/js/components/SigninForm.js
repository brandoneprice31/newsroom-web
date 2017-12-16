import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Container, Grid, Image, Segment, Comment, Button, Input, Divider } from 'semantic-ui-react';

import {signInUser} from '../actions';
import Client from '../client/client';

class SigninForm extends Component {
  constructor(props){
    super(props);
    this.state = { showConfirm: false };
  }

  render() {
    var arr = [
      (<h1>NewsRoom</h1>),
      (<Input id="username" type="text" size="small" placeholder="username"></Input>),
      (<Input id="password" type="text" size="small" placeholder="password"></Input>),
      (<Container>
        <Button onClick={() => this.loginClick()} size='mini'>Login</Button>
        <Button onClick={() => this.signUpClick()} size='mini'>Sign-Up</Button>
      </Container>)
    ];

    if (this.state.showConfirm) {
      arr.splice(3, 0, (<Input id="confirm" type="text" size="small" placeholder="confirm password"></Input>));
    }

    return (
      <Container fluid>
        <Grid centered style={{top: 100, position: "relative"}}>
          {
            arr.map((elem, index) => (
              <Grid.Row key={index}>
                {elem}
              </Grid.Row>
            ))
          }
        </Grid>
      </Container>
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
