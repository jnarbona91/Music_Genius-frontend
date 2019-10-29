import React from "react";
import Websocket from "react-websocket";
import { Button } from "reactstrap"
// import { threadId } from "worker_threads";
import Spotify from './Spotify'

export default class Cortex extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            token: "", //storing cortext token for authentication
            method: "", //storing the last request method so we know how to handle the response
            headset: "", //storing the headset id
            connected: false,
            id_sequence: 1,  // sequence for websocket calls
            callbacks: {},  // keys are id_sequence, values are callbacks
            eng: "",
            exc: "",
            str: "",
            rel: "",
            int: "",
            foc: ""
          };

        this.handleData = this.handleData.bind(this);
    }

    handleOpen() {
        console.log("[DEBUG] connected");
    }

    sendHello(){
           // Grab the current id_sequence and increment
           let id = this.state.id_sequence;
           this.state.id_sequence += 1;
           this.state.callbacks[id] = this.hello_callback;  // set up our callback
        let msg = {
            "jsonrpc": "2.0",
            "method": "getCortexInfo",
            "id":id
            }

        this.refWebSocket.sendMessage(JSON.stringify(msg));

    }

    hello_callback = (data) => {
        console.log("Running callback for sendHello()");
        console.log(data);

        // remove callback from callbacks object
        delete this.state.callbacks[data.id];

    }


    getUserLogin(){
        let id = this.state.id_sequence;
        this.state.id_sequence += 1;
        this.state.callbacks[id] = this.userLogin_callback;
       let msg = {
            "jsonrpc": "2.0",
            "method": "getUserLogin",
            "id":id
            }
        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    userLogin_callback = (data) => {
        console.log("Running callback for userLogin()");
        console.log(data);

        // remove callback from callbacks object
        delete this.state.callbacks[data.id];
        this.getRequestAccess();
    }

    getRequestAccess(){
        let id = this.state.id_sequence;
        this.state.id_sequence += 1;
        this.state.callbacks[id] = this.requestAccess_callback;

        let msg = {
            "id":id,
            "jsonrpc": "2.0",
            "method": "requestAccess",
            "params": {
                "clientId": "zrTtgE4m4XN2z74UC5wRXOMEfqqtT20glr0rJf08",
                "clientSecret": "UyNffuiGrWOIUJfrUrqJeiAbVAsgNm7Tyw58AVbYkKEGI4l5MPzKo56K0vvuoWOjgujx5YNoc6CcJvZxOxgICsAjwsy63AF4gfvq9a68fdvY4YgOzafRXeqjWwAbYymK"
            }
        }

        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    requestAccess_callback = (data) => {
        console.log("[DEBUG] Requesting access... please check your cortext app!");
        console.log(data);

        // remove callback from callbacks object
        delete this.state.callbacks[data.id];
        this.getAuthentication();
    }

    getAuthentication(){
        let id = this.state.id_sequence;
        this.state.id_sequence += 1;
        this.state.callbacks[id] = this.authentication_callback;

        let msg = {
            "id": id,
            "jsonrpc": "2.0",
            "method": "authorize",
            "params": {
                "clientId": "zrTtgE4m4XN2z74UC5wRXOMEfqqtT20glr0rJf08",
                "clientSecret": "UyNffuiGrWOIUJfrUrqJeiAbVAsgNm7Tyw58AVbYkKEGI4l5MPzKo56K0vvuoWOjgujx5YNoc6CcJvZxOxgICsAjwsy63AF4gfvq9a68fdvY4YgOzafRXeqjWwAbYymK"
            }
        }

        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    authentication_callback = (data) => {
        console.log("Running callback for authentication()");
        console.log(data);
        this.state.token = data.result.cortexToken;
        console.log("[DEBUG] received token = " + this.state.token)


        // remove callback from callbacks object
        delete this.state.callbacks[data.id];
        this.queryHeadsets();
    }

    queryHeadsets(){
        let id = this.state.id_sequence;
           this.state.id_sequence += 1;
           this.state.callbacks[id] = this.queryHeadsets_callback;

        let msg = {
            "id": id,
            "jsonrpc": "2.0",
            "method": "queryHeadsets",
            "params": {
                "id": "EPOC-*"
            }
        };
        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    queryHeadsets_callback = (data) => {
        console.log("Running callback for queryHeadset()");
        console.log(data);
        if (data.result.length > 0){
            this.state.headset = data.result[0].id;
            console.log("[DEBUG] headset id is: " + this.state.headset);
        } else{
            this.state.headset = "";
            console.log("[DEBUG] no headsets found");
        }
        // remove callback from callbacks object
        delete this.state.callbacks[data.id];
        this.connectHeadset();


    }

    connectHeadset(){
        let id = this.state.id_sequence;
        this.state.id_sequence += 1;
        this.state.callbacks[id] = this.controlDevice_callback;

        if (this.state.headset != "")
        {
            let msg = {

                    "id":id,
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
        if (this.state.connected == true){ //check if app is actually connected
            let id = this.state.id_sequence;
            this.state.id_sequence += 1;
            this.state.callbacks[id] = this.controlDevice_callback;

            if (this.state.headset != "")
            {
                let msg = {

                        "id":id,
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
        } else {
            console.log("Already disconnected, please connect first!")
        }
    }

    controlDevice_callback = (data) => {
        console.log("Running callback for connest and disconnet()");
        console.log(data);
        if (data.result.command == "connect"){
            console.log("connected!!!");
            this.state.connected = true;
        } else if (data.result.command == "disconnect"){
            console.log("disconnected. :(");
            this.state.connected = false;
        } else { //refresh
            console.log("refresh request was called, not sure what we do with that.")
        }

        // remove callback from callbacks object
        delete this.state.callbacks[data.id];
    }

    handleData(data) {
        // console.log(this.state.method);
        let result = JSON.parse(data);
        console.log(result);

        // call the registered callback
        this.state.callbacks[result.id](result);
    }

    render() {
        return (
            <div>

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
             <Button onClick={() => this.getUserLogin()}>Connect Headset</Button>
             {/* <Button onClick={() => this.getRequestAccess()}>Request Access</Button>
             <Button onClick={() => this.getAuthentication()}>Authorize</Button>
             <br>
             </br>

             <Button onClick={() => this.queryHeadsets()}>Find Headset</Button>
             <br>
             </br> */}

             {/* <Button onClick={() => this.connectHeadset()}>Connect Headset</Button> */}
             <Button onClick={() => this.disconnectHeadset()}>Disconnect Headset</Button>
             <h2>Set your sensetivity level</h2>

             <Button>Sensetivity Nob</Button>
             <Spotify eng={this.state.eng} exc={this.state.exc} str={this.state.str} rel={this.state.rel} int={this.state.int} foc={this.state.foc}/>
            </div>
        )
    };
}
