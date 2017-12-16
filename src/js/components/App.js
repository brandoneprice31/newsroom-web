import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Container } from 'semantic-ui-react';

import SigninForm from '../components/SigninForm';
import NewsRoom from '../components/NewsRoom';
import {signInUser} from '../actions';

class App extends Component {
  render() {
    //this.logoutCachedUser()

    var cachedUser = this.getCachedUser();

    if (cachedUser && !this.props.user) {
      this.props.signInUser(cachedUser);
    }

    var currDisplay = null;

    if (!this.props.user) {
      currDisplay = ( <SigninForm /> );
    } else {
      this.saveCachedUser(this.props.user);
      currDisplay = ( <NewsRoom /> );
    }

    return (
      <Container fluid>
        { currDisplay }
      </Container>
    );
  }

  getCachedUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  saveCachedUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  logoutCachedUser() {
    localStorage.removeItem("user");
  }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
  return {
    signInUser: (user) => {
      dispatch(signInUser(user))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
