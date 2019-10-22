import React from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
const spotifyApi = new SpotifyWebApi()

export default class Spotify extends React.Component{
  constructor(){
    super()
    const params = this.getHashParams()
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
          albumArt: resp.item.album.images[0].url
        }
      })
    })
  }

  skipSong(){
    spotifyApi.skipToNext()
    .then((resp)=>{
      return this.getPlaying()
    })
  }

  render(){
    return(
      <div>
        <div>
          <a href="http://localhost:8888">Link to Spotify</a>
          <div>{this.state.nowPlaying.name}</div>
          <img alt="album art" src={this.state.nowPlaying.albumArt} style={{height: '150px', width: '150px'}}/>
        </div>
        <div>
        { this.state.loggedIn &&
          <div>
            <div>
              <button onClick={() => this.getPlaying()}>
                Check Now Playing
              </button>
            </div>
            <div>
              <button onClick={()=> this.skipSong()}>
                Skip Song
              </button>
            </div>
          </div>

        }
        </div>
      </div>
    )
  }
}
