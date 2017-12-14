import React, {Component} from 'react';
import {connect} from 'react-redux';
import Client from '../client/client';
import {pageChange, commentsChange} from '../actions'

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
        )
      }

      return (
        <div>
          <h1>NewsRoom</h1>
          {this.props.user.username}
          <hr />
          <h2>{title}</h2>
          <input id="pageInput" type="text" onChange={() => this.pageInputChanged()} />
          {table}
        </div>
      )
  }

  pageInputChanged() {
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

    Client.get("pages", { url: newURL },
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
      }
    );
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
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(NewsRoom);
