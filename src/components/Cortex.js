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
            headset: "", //storing the headset id
            connected: false
          };
        this.handleData = this.handleData.bind(this);
    }

    handleOpen() {
        console.log("[DEBUG] connected");
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

    connectHeadset(){
        this.state.method = "controlDevice";

        if (this.state.headset != "")
        {
            let msg = {
                
                    "id": 1,
                    "jsonrpc": "2.0",
                    "method": "controlDevice",
                    "params": {
                        "command": "connect",
                        "headset": this.state.headset
                    }
                };

            console.log(msg);
            this.refWebSocket.sendMessage(JSON.stringify(msg));
        }
    }

    disconnectHeadset(){
        this.state.method = "controlDevice";

        if (this.state.headset != "")
        {
            let msg = {
                
                    "id": 1,
                    "jsonrpc": "2.0",
                    "method": "controlDevice",
                    "params": {
                        "command": "disconnect",
                        "headset": this.state.headset
                    }
                };
                
            console.log(msg);
            this.refWebSocket.sendMessage(JSON.stringify(msg));
        }
    }
    
    handleData(data) {
        console.log(this.state.method);
        let result = JSON.parse(data);
        console.log(result);

        if (result.result == undefined)
        {
            console.log("received error from " + this.state.method + " request, abort...")
            return;
        }

        switch(this.state.method){
            case "requestAccess":
                    console.log("[DEBUG] Requesting access... please check your cortext app!")
                    break;
            case "authorize":
                    this.state.token = result.result.cortexToken;
                    console.log("[DEBUG] received token = " + result.result.cortexToken)
                    break;
            case "queryHeadsets":
                if (result.result.length > 0){
                    this.state.headset = result.result[0].id;
                    console.log("[DEBUG] headset id is: " + this.state.headset);
                } else{
                    this.state.headset = "";
                    console.log("[DEBUG] no headsets found");
                }
                break;
            case "controlDevice":
                if (result.result.command == "connect"){
                    console.log("connected!!!");
                    this.state.connected = true;
                } else if (result.result.command == "disconnect"){
                    console.log("disconnected. :(");
                    this.state.connected = false;
                } else { //refresh 
                    console.log("refresh request was called, not sure what we do with that.")
                }

                console.log(result.result.message);
                break;
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

             <Button onClick={() => this.connectHeadset()}>Connect Headset</Button>
             <Button onClick={() => this.disconnectHeadset()}>Disconnect Headset</Button>
             <h2>Set your sensetivity level</h2>
             
             <Button>Sensetivity Nob</Button>
            </div>
        )
    };
}
