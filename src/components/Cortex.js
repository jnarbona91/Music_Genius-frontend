import React from "react";
import Websocket from "react-websocket";
import { Button } from "reactstrap"


export default class Cortex extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            token: ""
          };
        this.handleData = this.handleData.bind(this);
    }

    handleOpen() {
        console.log("connected");
    }

    sendHello(){
        let msg = {
            "jsonrpc": "2.0",
            "method": "getCortexInfo",
            "id":1
            }
        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    getUserLogin(){
        let msg = {
            "jsonrpc": "2.0",
            "method": "getUserLogin",
            "id":1
            }
        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    getRequestAccess(){
        let msg = {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "requestAccess",
            "params": {
                "clientId": "zrTtgE4m4XN2z74UC5wRXOMEfqqtT20glr0rJf08",
                "clientSecret": "UyNffuiGrWOIUJfrUrqJeiAbVAsgNm7Tyw58AVbYkKEGI4l5MPzKo56K0vvuoWOjgujx5YNoc6CcJvZxOxgICsAjwsy63AF4gfvq9a68fdvY4YgOzafRXeqjWwAbYymK"
            }
        }

        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    getAuthentication(){
        let msg = {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "authorize",
            "params": {
                "clientId": "zrTtgE4m4XN2z74UC5wRXOMEfqqtT20glr0rJf08",
                "clientSecret": "UyNffuiGrWOIUJfrUrqJeiAbVAsgNm7Tyw58AVbYkKEGI4l5MPzKo56K0vvuoWOjgujx5YNoc6CcJvZxOxgICsAjwsy63AF4gfvq9a68fdvY4YgOzafRXeqjWwAbYymK"
            }
        }

        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    handleData(data) {
        let result = JSON.parse(data);
        console.log(result);

        if (this.state.token === "" || this.state.token === undefined) {
            this.state.token = result.result.cortexToken;
            console.log("received token = " + result.result.cortexToken)
          }
      }


    render() {
        return (
            <div>
            <h1>Test</h1>
                <Websocket
            url="wss://localhost:6868"
            onMessage={this.handleData}
            onOpen={this.handleOpen}
            debug={true}
            ref={Websocket => {
                this.refWebSocket = Websocket;
            }}
            />
             {/* this is just for test connecting to api
             <Button onClick={() => this.sendHello()}>Get Info</Button> */}
             <Button onClick={() => this.getUserLogin()}>User Login</Button>
             <Button onClick={() => this.getRequestAccess()}>Request Access</Button>
             <Button onClick={() => this.getAuthentication()}>Authorize</Button>
            </div>
        )
    };
}
