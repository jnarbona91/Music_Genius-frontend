import React from "react";


export default class Login extends React.Component {
   state = {
       credentials: {
           username: '',
           password: ''
       },
   }

  login = event => {
      fetch('http://0.0.0.0:8000/auth/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(this.state.credentials)
      })
      .then( data => data.json())
      .then(
          data => {
              this.props.userLogin(data.token);
              console.log(data.token)
          }
      )
      .catch( error => console.error(error))
  }

  register = event => {
       fetch('http://0.0.0.0:8000/api/users/', {
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(this.state.credentials)
       })
       .then( data => data.json())
       .then(
           data => {
               console.log(data.token);
           }
       )
       .catch( error => console.error(error))
   }
  inputChanged = event => {
      const cred = this.state.credentials;
      cred[event.target.name] = event.target.value;
      this.setState({credentials: cred});
  }
   signup = event => {
       this.register();
       this.login();
   }
  render() {
      return (
          <div >
              <h1>Login</h1>
              <br />
              <label>
                  <center>
                  Username<br/>
                  <input type="text" name="username"
                  value={this.state.credentials.username}
                  onChange={this.inputChanged} />
                  </center>
              </label>
              <br/>
              <label>
                <center>
                  Password<br />
                    <input type="password" name="password"
                    value={this.state.credentials.password}
                    onChange={this.inputChanged} />
                </center>
              </label>
              <br/>
              <br/>
              <button onClick={this.login}>Login</button>&nbsp;&nbsp;&nbsp;
              <button onClick={this.signup}>Signup</button>
          </div>
      );
  }
}







