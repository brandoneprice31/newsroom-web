import React, {Component} from 'react';
import {connect} from 'react-redux';
import Client from '../client/client';
import Comments from './Comments';
import Related from './Related';
import {pageChange, commentsChange, logOutUser} from '../actions'
import { Icon, Header, Dimmer, Container, Grid, Image, Segment, Comment, Button, Input, Divider, TextArea } from 'semantic-ui-react';
import $ from "jquery";

class NewsRoom extends Component {
  constructor(props){
    super(props);
    this.state = { showRelated: true };
  }

  render() {
      var title = (this.props.page) ? this.props.page.website : "Enter a url:";
      var table = null;
      var iFrame = null;

      if (this.props.comments) {
        var relatedOrComments = this.state.showRelated ? (<Related changePage={(url) => this.changeToRelated(url)}/>) : (<Comments />);

        table = (
          <Grid.Row>
            <Container fluid>
              <Grid>
                <Grid.Row>
                  <Container fluid>
                    <Grid centered>
                      <Grid.Row>
                        <Button.Group>
                          <Button id="RelatedButton" active  onClick={() => this.relatedButtonClicked()}>
                            Related
                          </Button>
                          <Button id="CommentsButton" onClick={() => this.commentsButtonClicked()}>
                            Comments
                          </Button>
                        </Button.Group>
                      </Grid.Row>
                    </Grid>
                  </Container>
                </Grid.Row>
                <Grid.Row>
                  {relatedOrComments}
                </Grid.Row>
              </Grid>
            </Container>
          </Grid.Row>
        );

        iFrame = (
          <Container fluid>
            <iframe id='iframe' src={this.getURL()} width="100%" style={{minHeight:window.outerHeight+400, height:"100%", overflow:"hidden"}} frameBorder="0" />
            <br />
          </Container>
        );
      } else {
        iFrame =  (
          <Container fluid>
              <Dimmer active={true} style={{minHeight:window.outerHeight, height:"100%"}}>
                <Header as='h2' icon inverted>
                  <Icon name='browser' />
                    Enter a URL
                  <Header.Subheader>and a page will be loaded here..</Header.Subheader>
                </Header>
              </Dimmer>
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
                <Grid.Row>
                  <Container style={{width: "85%", height:160}}>
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
                  </Container>
                </Grid.Row>
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

  changeToRelated(url) {
    document.getElementById("pageInput").value = url;
    this.pageInputChanged();
  }

  pageInputChanged() {
    this.setState({
      showRelated: true
    });

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

  relatedButtonClicked() {
    var relatedButton = document.getElementById("RelatedButton");
    var commentsButton = document.getElementById("CommentsButton");
    $(relatedButton).addClass('active');
    $(commentsButton).removeClass('active');

    this.setState({
      showRelated: true
    });
  }

  commentsButtonClicked() {
    var relatedButton = document.getElementById("RelatedButton");
    var commentsButton = document.getElementById("CommentsButton");
    $(relatedButton).removeClass('active');
    $(commentsButton).addClass('active');

    this.setState({
      showRelated: false
    });
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
