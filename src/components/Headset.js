import React from "react";
import Websocket from "react-websocket"; 
import { Button } from "reactstrap"

export default class Headset extends React.Component{
    constructor(props) {
        super(props);
        
    }  
}

handleHeadset() {
    let msg = {
      jsonrpc: "2.0",
      method: "queryHeadsets",
      params: {
        id: "EPOCPLUS-*"
      },
      id: 1
    };
    this.refWebSocket.sendMessage(JSON.stringify(msg));
  }

  connectHeadset(){
      let msg = {
          jsonrpc: "2.0",
          method: "controlDevice",
          params: {
              "command": "connect"
              "headset": "EPOCPLUS-*"
          }
      }
  }

  disconnectHeadset(){
    let msg = {
        {   "id": 1,
            "jsonrpc": "2.0",
            "method": "controlDevice",
            "params": {
                "command": "disconnect",
                "headset": "EPOCFLEX-12341234"
            }
        }
    }
}


refreshList(){
    let msg = {
        {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "controlDevice",
            "params": {
                "command": "refresh"
            }
        }
    }
}

render() {
    return(
        <div>
            <Button onClick={() => this.connectHeadset()}>Connect</Button>
            <Button onClick={() => this.disconnectHeadset()}>Disconnect</Button>
            <Button onClick={() => this.disconnectHeadset()}>Refresh</Button>
   
        </div>
    )
}



