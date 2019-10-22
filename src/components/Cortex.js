import React from "react";
import Websocket from "react-websocket";
import { Button } from "reactstrap"


export default class Cortex extends React.Component{
    constructor(props) {
        super(props);
    }

    handleOpen() {
        console.log("connected");
    }

    sendHello(){
        let msg = {
        jsonrpc: "2.0",
        method: "getCortexInfo",
        "id":1
        }
        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }

    handleData(data) {
        let result = JSON.parse(data);
        console.log(result);
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
             <Button onClick={() => this.sendHello()}>Get Info</Button>
            </div>
        )
    };
}
