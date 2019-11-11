import React from "react";
import Spotify from './Spotify'

import Cortex from './Cortex'

export default class Genius extends React.Component{
    constructor(props) {
        super(props);
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
                <Spotify ref="spotifyComponent" parentCallback = {this.spotifyCallback}/>
                
            </div>
            
        );
    }
}
