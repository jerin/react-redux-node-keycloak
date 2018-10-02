import React, { Component } from 'react';

class APIResponse extends Component {
  render() {
    if(this.props.response == null)
      return (<div/>);
    else
      return ( <pre>{this.props.response}</pre> );
  }
}

class QueryAPI extends Component {

  constructor(props) {
    super(props);
    this.state = { response: null };
  }

  authorizationHeader() {
    if(this.props.keycloak) return {
      headers: {
        "Authorization": "Bearer " + this.props.keycloak.token
      }
    }; else return {};
  }

  handleClick = () => {
    fetch('http://localhost:9000/', this.authorizationHeader())
      .then(response => {
        if (response.status === 200)
          return response.json();
        else
          return { status: response.status, message: response.statusText }
      })
      .then(json => this.setState((state, props) => ({
        response: JSON.stringify(json, null, 2)
      })))
      .catch(err => {
        this.setState((state, props) => ({ response: err.toString() }))
      })
  }

  render() {
    return (
      <div className="QueryAPI">
        <button onClick={this.handleClick}>Send API request</button>
        <APIResponse response={this.state.response}/>
      </div>
    );
  }
}

export default QueryAPI;
