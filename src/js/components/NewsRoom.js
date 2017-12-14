import React, {Component} from 'react';
import {connect} from 'react-redux';
import Client from '../client/client';
import {pageChange, commentsChange, logOutUser} from '../actions'

class NewsRoom extends Component {
  constructor(props){
    super(props);
    this.state = { showConfirm: false };
  }

  render() {
      var title = (this.props.page) ? this.props.page.website : "Enter a page:";
      var table = null;
      if (this.props.comments) {
        table = (
          <ul>
            {this.props.comments.map((comment) => (
              <li><b>{comment.user.username}:</b> {comment.message}</li>
            ))}
          </ul>
        );
      }
      var submitCommentForm = null;
      if (this.props.page) {
        submitCommentForm = (
          <div>
            <input id="commentInput" type="text" />
            <br />
            <button onClick={() => this.submitCommentClicked()}>Submit</button>
          </div>
        );
      }

      return (
        <div>
          <h1>NewsRoom</h1>
          <hr />
          <h2>{title}</h2>
          <input id="pageInput" type="text" onChange={() => this.pageInputChanged()} />
          {table}
          {submitCommentForm}
          <hr />
          {this.props.user.username}
          <br />
          <button onClick={ () => this.logOutClicked() }>Logout</button>
        </div>
      )
  }

  pageInputChanged() {
    var url = this.getURL();

    if (url == null || url == "") {
      this.props.pageChange(null);
      this.props.commentsChange(null);
      return;
    }

    // Get the page.
    Client.get("pages", { url: url },
      function (response) {
        // Only change state if the page id changed.
        if (this.props.page && response.page._id == this.props.page._id) {
          return;
        }

        this.props.pageChange(response.page);
        this.props.commentsChange(response.comments);
      }.bind(this),
      function (error) {
        console.log('Error:', error);
        this.props.pageChange(null);
        this.props.commentsChange(null);
      }.bind(this)
    );
  }

  submitCommentClicked() {
    var submitButton = document.getElementById('commentInput');
    var message = submitButton.value;
    submitButton.value = "";

    // Submit new comment.
    Client.post('users/' + this.props.user._id + '/pages/' + this.props.page._id + '/comments',
      { message: message },
      function (response) {

        // Get the new page comments.
        Client.get('pages', {url: this.getURL()},
          function (response) {
            this.props.commentsChange(response.comments);
          }.bind(this),
          function (error) {
            console.log(error);
          }
        )

      }.bind(this),
      function (error) {
        console.log(error);
      }
    );
  }

  logOutClicked() {
    localStorage.removeItem("user");
    this.props.commentsChange(null);
    this.props.pageChange(null);
    this.props.logOutUser();
  }

  // Parses current url.
  getURL() {
    var url = document.getElementById("pageInput").value;
    var oldURL = url
    var index = 0;
    var newURL = oldURL;
    index = oldURL.indexOf('?');
    if(index == -1){
        index = oldURL.indexOf('#');
    }
    if(index != -1){
        newURL = oldURL.substring(0, index);
    }

    return newURL;
  }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        page: state.page,
        comments: state.comments
    };
}


function mapDispatchToProps(dispatch) {
  return {
    pageChange: (page) => {
      dispatch(pageChange(page))
    },
    commentsChange: (comments) => {
      dispatch(commentsChange(comments))
    },
    logOutUser: () => {
      dispatch(logOutUser())
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(NewsRoom);
