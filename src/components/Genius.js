import React from "react";
import Spotify from './Spotify'
import Cortex from './Cortex'
import Graph from './Graph'
import { 
    Card, 
    Button, 
    CardTitle, 
    CardText, 
    Row, 
    Col 
} from 'reactstrap';

export default class Genius extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            eng: 0,
            exc: 0,
            str: 0,
            rel: 0,
            int: 0,
            foc: 0,
            
        };
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

    graphCallback = (engVal, excVal, strVal, relVal, intVal, focVal) => {
        this.setState({ eng: engVal*100, exc: excVal*100, str: strVal*100, rel: relVal*100, int: intVal*100, foc: focVal*100 })
    }

    render() {
        return (
            <div className="container-fluid">
                <div>
                    <center>
                        <Cortex ref="cortexComponent" parentCallback = {this.cortexCallback} graphCallback = {this.graphCallback}/>
                    </center>
                </div>
                <br /><br />
                <div>
                <Row className="justify-content-center">
                    <Col sm="4" >
                        <Card body className="text-center" >
                            <Spotify ref="spotifyComponent" parentCallback = {this.spotifyCallback}/>
                        </Card>
                    </Col>
                    <Col sm="6.1"> 
                        <Card body className="text-center">
                            <Graph eng={this.state.eng} exc={this.state.exc} str={this.state.str} rel={this.state.rel} int={this.state.int} foc={this.state.foc} sessions={this.startSessions}/>
                        </Card>
                    </Col>     
                </Row> 
                </div>  
            </div>
            
        );
    }
}
