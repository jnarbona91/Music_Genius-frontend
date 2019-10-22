import React from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
const spotifyApi = new SpotifyWebApi()

export default class Spotify extends React.Component{
  constructor(){
    super()
    const params = this.getHashParams()
    console.log(params)
    const token = params.access_token
    if(token){
      spotifyApi.setAccessToken(token)
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' }
    }
  }

  getHashParams(){
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g
    var q = window.location.hash.substring(1)
    e = r.exec(q)
    while(e){
      hashParams[e[1]] = decodeURIComponent(e[2])
      e= r.exec(q);
    }
    return hashParams
  }

  getPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
    .then((resp)=>{
      this.setState({
        nowPlaying: {
          name: resp.item.name,
          albumArt: resp.item.album.imgages[0].url
        }
      })
    })
  }

  render(){
    return(
      <div>
        <div>
          <a href="http://localhost:8888">Link to Spotify</a>
          <div>{this.state.nowPlaying.name}</div>
          <img src={this.state.nowPlaying.albumArt}/>
        </div>
        <div>
        { this.state.loggedIn &&
          <button onClick={() => this.getPlaying()}>
            Check Now Playing
          </button>
        }
        </div>
      </div>
    )
  }
}
