import React from "react";
import Websocket from "react-websocket";
import { Button } from "reactstrap"
// import { threadId } from "worker_threads";



export default class Cortex extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            token: "", //storing cortext token for authentication
            method: "", //storing the last request method so we know how to handle the response
            headset: "" //storing the headset id
          };
        this.handleData = this.handleData.bind(this);
    }

    handleOpen() {
        console.log("connected");
    }

    sendHello(){
        this.state.method = "getCortexInfo"

        let msg = {
            "jsonrpc": "2.0",
            "method": "getCortexInfo",
            "id":1
            }

        this.refWebSocket.sendMessage(JSON.stringify(msg));
        
    }

    getUserLogin(){
        this.state.method = "getUserLogin"

        let msg = {
            "jsonrpc": "2.0",
            "method": "getUserLogin",
            "id":1
            }
        this.refWebSocket.sendMessage(JSON.stringify(msg));

    }

    getRequestAccess(){
        this.state.method = "requestAccess"

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
        this.state.method = "authorize"
        
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

    queryHeadsets(){
        this.state.method = "queryHeadsets"

        let msg = {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "queryHeadsets",
            "params": {
                "id": "EPOC-*"
            }
        };
        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    connectHeadsets(){
        this.state.method = "controlDevice"

        let msg = {
            
                "id": 1,
                "jsonrpc": "2.0",
                "method": "controlDevice",
                "params": {
                    "command": "connect",
                    "headset": "EPOC-*"
                }
            };
        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }
    


    handleData(data) {
        console.log(this.state.method);
        let result = JSON.parse(data);
        console.log(result);
        switch(this.state.method){
            case "requestAccess":
                    console.log("Requesting access... please check your cortext app!")
                    break;
            case "authorize":
                    this.state.token = result.result.cortexToken;
                    console.log("received token = " + result.result.cortexToken)
                    break;
            case "queryHeadsets":
                if (result.result.length > 0)
                {
                    this.state.headset = result.result[0].id;
                    console.log("headset id is: " + this.state.headset);
                }
                else{
                    this.state.headset = "";
                    console.log("no headsets found");
                }
                    
                break;
        }
      }

      controlDevice(command) {
          let result = JSON.parse(command);
          console.log(result);
          if (this.state.headset === "" || this.state.headset === undefined) {
              this.state.headset = ""
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
             <br>
             </br>
           
             <Button onClick={() => this.queryHeadsets()}>Find Headset</Button>
             <br>
             </br>

             <Button onClick={() => this.controlDevice()}>Connect Headset</Button>
             <h2>Set your sensetivity level</h2>
             
             <Button>Sensetivity Nob</Button>
            </div>
        )
    };
}
