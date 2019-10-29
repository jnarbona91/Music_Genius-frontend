import React from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
const spotifyApi = new SpotifyWebApi()

export default class Spotify extends React.Component{
  constructor(props){
    super(props)
    const params = this.getHashParams()
    const token = params.access_token
    if(token){
      spotifyApi.setAccessToken(token)
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '', uri: '' },
      userId: "",
      currentPlaylist: "",
      playlistSongs: [],
      duration: "",
    }
  }
  //returns both request and access tokens
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
      var str = resp.item.uri
      var result = str.substring(str.indexOf("playlist:") + 9)
      var song = resp.item.uri
      this.setState({
        nowPlaying: {
          name: resp.item.name,
          albumArt: resp.item.album.images[0].url,
          userId: resp.device.id,
          uri: song
        },
        currentPlaylist: result,
      })
      console.log(resp)
    })
  }

  getCurrentPlaylist(){
    spotifyApi.getPlaylist(this.state.currentPlaylist)
    .then((resp)=>{
      return resp
    })
  }

  skipSong(){
    spotifyApi.skipToNext()
      return this.getPlaying()
  }

  prevSong(){
    spotifyApi.skipToPrevious()
      return this.getPlaying()
  }

  excPlaylist(){
    const { exc } = this.props
    if(exc >= .6){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri])
    }
  }

  engPlaylist(){
    const { eng } = this.props
    if(eng >= .6){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri])
    }
  }

  strPlaylist(){
    const { str } = this.props
    if(str >= .6){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri])
    }
  }

  relPlaylist(){
    const { rel } = this.props
    if(rel >= .6){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri])
    }
  }

  intPlaylist(){
    const { int } = this.props
    if(int >= .6){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri])
    }
  }

  focPlaylist(){
    const { foc } = this.props
    if(foc >= .6){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri])
    }
  }

  excPlaylist(){
    const { eng, exc, str, rel, int, foc } = this.props
    if(exc >= .6){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri])
    }
  }

  createNewPlaylist(){
    spotifyApi.createPlaylist('melted_snowman', { name: "New Playlist"})
    .then((resp)=>{
      console.log(resp)
    })
  }

  getUserId(){
    spotifyApi.getMe()
    .then((resp)=>{
      this.setState({
        userId: resp.is
      })
    })
  }

  playlistTracks(){
    spotifyApi.getPlaylistTracks("5TOheLold9VEiIUcljAQlK")
    .then((resp)=>{
      resp.items.map((song)=>{
        return this.state.playlistSongs.push(song.track.name)
      })
    })
  }

  // getCurrentTrack(){
  //   spotifyApi.getMyCurrentPlayingTrack()
  //   .then((resp)=>{
  //     this.setState({duration: resp.item.duration_ms})
  //   })
  // }

  componentDidMount(){
    this.getPlaying();
    spotifyApi.getMyCurrentPlaybackState()
    .then((resp)=>{
      let timer = resp.item.duration_ms - resp.progress_ms
      setInterval(()=> this.getPlaying(), timer + 10)
      console.log(timer)
    })
  }

  render(){
    return(
      <div className="spotify-div">
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
              <button onClick={() => this.skipSong()}>
                Skip Song
              </button>
            </div>
            <div>
              <button onClick={()=> this.prevSong()}>
              Previous Song
              </button>
            </div>
            <div>
              <button onClick={()=> this.excPlaylist()}>
                Add to Playlist
              </button>
            </div>
            <div>
              <button onClick={()=> this.createNewPlaylist()}>
                Create Playlist
              </button>
            </div>
            <div>
              <button onClick={()=> this.getCurrentPlaylist()}>
                Retrieve Playlist
              </button>
            </div>
          </div>

        }
        </div>
      </div>
    )
  }
}
