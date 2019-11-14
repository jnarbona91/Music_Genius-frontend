import React from "react";
import Websocket from "react-websocket";
import { Button } from "reactstrap"


var clientId = "zrTtgE4m4XN2z74UC5wRXOMEfqqtT20glr0rJf08";
var clientSecret = "UyNffuiGrWOIUJfrUrqJeiAbVAsgNm7Tyw58AVbYkKEGI4l5MPzKo56K0vvuoWOjgujx5YNoc6CcJvZxOxgICsAjwsy63AF4gfvq9a68fdvY4YgOzafRXeqjWwAbYymK";
export default class Cortex extends React.Component{

  constructor(props) {
    super(props);
    this.token = ""; //storing cortext token for authentication
    this.headset = ""; //storing the headset id
    this.connected = false;
    this.id_sequence = 1;  // sequence for websocket calls
    this.callbacks = {};  // keys are id_sequence, values are callbacks
    this.session_id = "";
    this.session_connected = false;
    this.all_streams = [ "met", "fac"];
    this.metrics = {eng: 0, exc: 0, str: 0, rel: 0, intt: 0, foc: 0};
    this.numSamples = 0;
    this.prevEyeAction = "neutral";
    this.prev2EyeAction = "neutral";
    this.refWebSocket = null;
    this.inPlaylist = [];
    
    this.handleData = this.handleData.bind(this);
  }

  handleOpen() {
    console.log("[DEBUG] websocket connected");
    // MSB: Could trigger configuration and setup from here?
  }
  
  handleSpotifyCommand(command){
    console.log("[Cortex] received message: " + command)

    if (command === "reset"){
      console.log("resetting average");
      this.resetAvg();
    } 
  }

  sendMessage(method, params, callback){
      let id = this.id_sequence
      this.id_sequence += 1;
      let msg = {
          'jsonrpc': '2.0',
          'method': method,
          'id': id};
      if (params !== null) { 
          msg.params = params;
      }
      this.callbacks[id] = callback;
      this.refWebSocket.sendMessage(JSON.stringify(msg));
  }
    

  sendHello(){
    // Grab the current id_sequence and increment
    // let id = this.id_sequence;
    // this.id_sequence += 1;
    // this.callbacks[id] = this.hello_callback;set up our callback
    this.sendMessage("getCortexInfo", null, this.hello_callback);
  }

  hello_callback = (data) => {
    console.log("Running callback for sendHello()");
    console.log(data);
    // remove callback from callbacks object
    delete this.callbacks[data.id];
  }

  getUserLogin(){
    this.sendMessage("getUserLogin", null, this.userLogin_callback);
  }

  userLogin_callback = (data) => {
    console.log("Running callback for userLogin()");
    console.log(data);
    // remove callback from callbacks object
    delete this.callbacks[data.id];
    this.getRequestAccess();
  }

  getRequestAccess(){
    let params = {
        "clientId": clientId,
        "clientSecret": clientSecret
      };
    this.sendMessage("requestAccess", params, this.requestAccess_callback);
  }

  requestAccess_callback = (data) => {
    console.log("[DEBUG] Requesting access... please check your cortext app!");
    console.log(data);
    // remove callback from callbacks object
    delete this.callbacks[data.id];
    this.getAuthentication();
  }

  getAuthentication(){
    let params = {
        "clientId": clientId,
        "clientSecret": clientSecret
      };
    this.sendMessage("authorize", params, this.authentication_callback);
  }

  authentication_callback = (data) => {
    console.log("Running callback for authentication()");
    console.log(data);
    this.token = data.result.cortexToken;
      
    console.log("[DEBUG] received token = " + this.token)
    // remove callback from callbacks object
    delete this.callbacks[data.id];
    this.queryHeadsets();
  }

  queryHeadsets(){
    let params = { "id": "EPOC-*" };
    this.sendMessage("queryHeadsets", params, this.queryHeadsets_callback);
  }

  queryHeadsets_callback = (data) => {
    console.log("Running callback for queryHeadset()");
    console.log(data);
    if (data.result.length > 0){
      this.headset = data.result[0].id;
      console.log("[DEBUG] headset id is: " + this.headset);
    } else {
      this.headset = '';
      console.log("[DEBUG] no headsets found");
    }
    // remove callback from callbacks object
    delete this.callbacks[data.id];
    this.connectHeadset();
  }

  connectHeadset(){
    if (this.headset === ""){
        return;  // no headset available?
    }
    let params = {
        "command": "connect",
        "headset": this.headset
    };
    this.sendMessage("controlDevice", params, this.controlDevice_callback);
  }

  disconnectHeadset(){
    if (this.connected !== true){ //check if app is actually connected
        console.log("Already disconnected, please connect first!")
        return;
    }
    if (this.headset === ""){
        console.log("No headset available?");
        return;
    }
    let params = {
        "command": "disconnect",
        "headset": this.headset
    };
    this.sendMessage("controlDevice", params, this.controlDevice_callback);
  }

  controlDevice_callback = (data) => {
    console.log("Running callback for connect and disconnect()");
    console.log(data);
    if (data.error) {
      console.log("error connecting/disconnecting: " + data.error.message);
    } else {
      if (data.result.command === "connect"){
        console.log("connected!!!");
        this.connected = true;
      }else if (data.result.command === "disconnect"){
        console.log("disconnected. :(");
        this.connected = false;
      }else { //refresh
        console.log("refresh request was called, not sure what we do with that.")
      }
  }
    // remove callback from callbacks object
    delete this.callbacks[data.id];
  }


  startSession(){
    let params = {
        "cortexToken": this.token,
        "headset": this.headset,
        "status": "active"
    };
    this.sendMessage("createSession", params, this.startSession_callback); 
  }

  startSession_callback = (data) => {
    console.log("Running callback for startSession()");
    console.log(data);
    if (data.error){
      console.log("error starting session: " + data.error.message);
    } else {
      this.session_id = data.result.id;
      this.session_connected = true;
      console.log(`Session id is ${this.session_id}`);
      this.subscribe();
    }
    delete this.callbacks[data.id];
  }

    // querySession(){
    //     let id = this.id_sequence;
    //         this.id_sequence += 1;
    //         this.callbacks[id] = this.querySession_callback;
    //     let msg = {
    //         "id":this.id_sequence,
    //         "jsonrpc": "2.0",
    //         "method": "querySessions",
    //         "params": {
    //             "cortexToken": this.state.token
    //         }
    //     };
    //     this.refWebSocket.sendMessage(JSON.stringify(msg));
    // }

    // querySession_callback = (data) => {

    //     console.log("Running callback for querySession()");
    //     console.log(data);
    // delete this.callbacks[data.id];
    // }


  closeSession(){
    if (this.session_connected === true){
        let params = {
            "cortexToken": this.token,
            "session": this.session_id,
            "status": "close"
        };
        this.sendMessage("updateSession", params, this.closeSession_callback);
    } else {
      console.log("There is currently no active session");
    }
  }

  closeSession_callback = (data) => {
    console.log("Running callback for closeSession()");
    console.log(data);
    this.session_connected = false;
    delete this.callbacks[data.id];
    this.unsubscribe();
  }

  // streams has default value of all streams; if user does not specify streams, all_streams will be subscribed
  subscribe(streams = this.all_streams){
    if (this.connected === true && this.session_connected === true){
      let params = {
          "cortexToken": this.token,
          "session": this.session_id,
          "streams": streams
      };
      this.sendMessage("subscribe", params, this.subscribe_callback);
    }
  }

  subscribe_callback = (data) => {
    console.log("Running callback for subscribe()");
    console.log(data);
    delete this.callbacks[data.id];
  }

  unsubscribe(){
    if (this.connected === true && this.session_connected === true){
      let params = {
          "cortexToken": this.token,
          "session": this.session_id,
          "streams": this.all_streams
      };
      this.sendMessage("unsubscribe", params, this.unsubscribe_callback);
    }
  }

  unsubscribe_callback = (data) => {
    console.log("Running callback for unsubscribe()");
    console.log(data);
    delete this.callbacks[data.id];
  }

  getDetectionInfo(){
    //request for facial detection info
    let params = {
        "detection": "facialExpression"
    };
    this.sendMessage("getDetectionInfo", params, this.startSession_callback); 
  }

  getDetectionInfo_callback = (data) => {
    console.log("Running callback for getDetectionInfo()");
    console.log(data);
  }

  handleData(data) {
    let result = JSON.parse(data);
    // let engArray = [];
    // let excArray = [];
    // let strArray = [];
    // let relArray = [];
    // let intArray = [];
    // let focArray = [];
    //console.log(result);
    if (result.id){
      // call the registered callback
      //console.log("executing callback for id = " + result.id);
      this.callbacks[result.id](result);
    }
    // if (this.state.connected === true && this.state.session_connected === true && result.met !== undefined){
    //   return engArray.push(result.met[1]), excArray.push(result.met[3]), strArray.push(result.met[6]), relArray.push(result.met[8]), intArray.push(result.met[10]), focArray.push(result.met[12])
    // }
    // let engMath = engArray.reduce((a, b) => a + b, 0) / engArray.length;
    // let excMath = excArray.reduce((a, b) => a + b, 0) / excArray.length;
    // let strMath = strArray.reduce((a, b) => a + b, 0) / strArray.length;
    // let relMath = relArray.reduce((a, b) => a + b, 0) / relArray.length;
    // let intMath = intArray.reduce((a, b) => a + b, 0) / intArray.length;
    // let focMath = focArray.reduce((a, b) => a + b, 0) / focArray.length;
    // this.setState({eng: engMath, exc: excMath, str: strMath, rel: relMath, int: intMath, foc: focMath})

    // console.log(engMath);
    // console.log(excMath);
    // console.log(strMath);
    // console.log(relMath);
    // console.log(intMath);
    // console.log(focMath);

    if (this.connected === true && this.session_connected === true){
      if (result.met !== undefined){
        this.handleMetData(result.met);
      }
      if (result.fac !== undefined){
        this.handleFacData(result.fac);
      }

    }
  }

  handleMetData(data){
    //console.log(data);
    //update averages
    let indexes = {eng: 1, exc: 3, str: 6, rel: 8, intt: 10, foc: 12};
    ['eng', 'exc', 'str', 'rel', 'intt', 'foc'].forEach((met) => {
        let new_val = data[indexes[met]];
        let avg = (this.metrics[met] * this.numSamples + new_val) / 
            (this.numSamples + 1);
        this.metrics[met] = avg;

        //if certain average exceeds arbitrary threshold, tell spotify to add
        //current song to playlist, if average goes below low threshold, skip
        //skip, meaning in either case, play next song, then reset all averages
        //and sample count.
        // console.log("Checking ", met, ": avg ", avg, " samples ", this.numSamples);
        if (avg > 0.1 && this.numSamples > 5 && this.inPlaylist.indexOf(met) === -1)
         {
            let cmd = 'add' + met;
            this.tellSpotify(cmd);
            this.inPlaylist.push(met);
            console.log("adding " + met + " to playlist");
        }
    

        console.log(met, " = ", avg);
    });
    this.numSamples += 1;

    // need to store the current average and number of samples in state for next
    // average calculation 
    // MSB: there must be a better way??
    this.props.graphCallback(data[1], data[3], data[6], data[8], data[10], data[12]);
  }

  handleFacData(data){
    let currentEyeAction = data[0];
    if ((currentEyeAction === "winkL" || currentEyeAction === "winkR")
        && currentEyeAction === this.prevEyeAction
        && currentEyeAction !== this.prev2EyeAction){
      console.log("userWinked");
      this.tellSpotify("skip");
    }
    this.prev2EyeAction = this.prevEyeAction;
    this.prevEyeAction = currentEyeAction;
    //this.setState({prevEyeAction: this.state.currentEyeAction, prev2EyeAction: this.state.prevEyeAction});
  }

  resetAvg() {
    this.metrics = {
        eng: 0, exc: 0, str: 0, rel: 0, intt: 0, foc: 0, numSamples: 0};
    this.inPlaylist = []; 
  }

  tellSpotify = (command) => {
      console.log("[Cortex] sending: " + command)
      this.props.parentCallback(command);
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
            <br>
            </br>
            <Button onClick={() => this.startSession()}>Start Session</Button>
            <Button onClick={() => this.closeSession()}>End Session</Button>
            <Button onClick={() => this.tellSpotify("addExc")}>Tell spotify to add</Button>
            <Button onClick={() => this.tellSpotify("skip")}>Tell spotify to skip</Button>
            <Button onClick={() => this.getDetectionInfo()}>Get trained facial command</Button>
           
            </div>
        )
    }
  }
