import React, {Component} from 'react';
import {connect} from 'react-redux';
import Client from '../client/client';
import {pageChange, commentsChange, logOutUser} from '../actions'
import { Container, Grid, Image, Segment, Comment, Button, Input, Divider, TextArea } from 'semantic-ui-react';

class NewsRoom extends Component {
  constructor(props){
    super(props);
    this.state = { showConfirm: false };
  }

  render() {
      var title = (this.props.page) ? this.props.page.website : "Enter a url:";
      var table = null;
      var iFrame = null;

      if (this.props.comments) {
        table = (
          <Grid.Row>
            <Container style={{width: "80%"}}>
              <Grid>
                <Grid.Row>
                  <div style={{overflowY: "scroll", height:400, width:"100%"}}>
                    <Comment.Group>
                      {this.props.comments.map((comment) => (
                        <Comment key={comment._id}>
                          <Comment.Content>
                            <Comment.Author>{comment.user.username}</Comment.Author>
                            <Comment.Text>{comment.message}</Comment.Text>
                          </Comment.Content>
                        </Comment>
                      ))}
                    </Comment.Group>
                  </div>
                </Grid.Row>
                <Grid.Row>
                  <Container fluid>
                    <Grid centered>
                      <Grid.Row>
                        <TextArea placeholder=" enter a comment..." id="commentInput" type="text" size='mini' style={{borderRadius: 2, minHeight: 75, minWidth: "90%", maxWidth:"90%", maxHeight:200}}/>
                      </Grid.Row>
                      <Grid.Row>
                        <Button onClick={() => this.submitCommentClicked()} size='medium' color='blue' style={{width:"50%"}}>
                          Submit
                        </Button>
                      </Grid.Row>
                    </Grid>
                  </Container>
                </Grid.Row>
              </Grid>
            </Container>
          </Grid.Row>
        );

        iFrame = (
          <Container fluid>
            <iframe id='iframe' src={this.getURL()} width="100%" style={{minHeight:900, height:"100%", overflow:"hidden"}} frameBorder="0" onLoad={() => this.iframeSrcChange()} />
            <br />
          </Container>
        );
      } else {
        iFrame =  (
          <Container fluid>
              <h1 style={{position: "absolute", top:"120%", left:"40%"}}>
                Enter a url...
              </h1>
          </Container>
        );
      }

      return (
        <Container fluid>
          <Grid columns='two'>
            <Grid.Column width={11} floated='left'>
              {iFrame}
            </Grid.Column>
            <Grid.Column width={5} floated='right'>
              <Grid divided='vertically'>
                <Container style={{width: "90%", height:160}}>
                  <Grid.Row>
                      <Grid>
                        <Grid.Row>
                          <h1 style={{top:20, position:"relative", fontSize:50}}>
                            NewsRoom
                          </h1>
                        </Grid.Row>
                        <Grid.Row>
                          <h4>
                            {title}
                          </h4>
                        </Grid.Row>
                        <Grid.Row>
                          <Input id="pageInput" type="text" onChange={() => this.pageInputChanged()} size='mini' style={{width:"70%", bottom:20, position:"relative"}}/>
                        </Grid.Row>
                      </Grid>
                  </Grid.Row>
                </Container>
                {table}
                <Grid.Row>
                  <Container fluid>
                    <Grid centered>
                      <Grid.Row>
                        <div style={{position:"relative", top:10}}>
                          {this.props.user.username}
                        </div>
                      </Grid.Row>
                      <Grid.Row>
                        <Button onClick={ () => this.logOutClicked() } size='mini' style={{position:"relative", bottom:15, width:"50%"}}>
                          Logout
                        </Button>
                      </Grid.Row>
                    </Grid>
                  </Container>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid>
        </Container>
      )
  }

  iframeSrcChange() {
    var iframe = document.getElementById('iframe');
    console.log("IFRAME:", iframe);
    document.getElementById("pageInput").value = iframe.src;
    this.pageInputChanged();
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
