import React from "react";
import Spotify from './Spotify'
import Graph from './Graph'
import Cortex from './Cortex'

export default class Genius extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            cortexMessage: "",
            //the performance metric stuff should no longer need to be here, but for the sake of not getting errors in graph component, temporarily add these here
            eng: 0,
            exc: 0,
            str: 0,
            rel: 0,
            int: 0,
            foc: 0,
        }   
    }
    cortexCallback = (cortexMsg) => {
        console.log("[Genius] forwarding command to spotify: " + cortexMsg);
        this.setState({cortexMessage: cortexMsg})
        this.refs.spotifyComponent.handleCortexCommand(cortexMsg);
    }

    spotifyCallback = (spotifyMsg) => {
        console.log("[Genius] forwarding command to cortex: " + spotifyMsg);
        this.setState({spotifyMessage: spotifyMsg})
        this.refs.cortexComponent.handleSpotifyCommand(spotifyMsg);
    }

    render() {
        return (
            <div>
                <Cortex ref="cortexComponent" parentCallback = {this.cortexCallback}/>
                <Spotify ref="spotifyComponent" parentCallback = {this.spotifyCallback} eng={this.state.eng} exc={this.state.exc} str={this.state.str} rel={this.state.rel} int={this.state.int} foc={this.state.foc} sessions={this.startSessions} dataFromCortex = {this.state.cortexMessage}/>
                <Graph eng={this.state.eng} exc={this.state.exc} str={this.state.str} rel={this.state.rel} int={this.state.int} foc={this.state.foc} sessions={this.startSessions}/>
            </div>
            
        );
    }
}
