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
    this.interval = null;
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '', uri: '' },
      userId: "",
      playlistId: "",
      currentPlaylist: "",
      playlistSongs: [],
      duration: "",
      error: null,
      timer: 0,
    }
    this.getPlaying = this.getPlaying.bind(this)
  }

  handleCortexCommand(command){
    console.log("[Spotify] received message: " + command)

    if (command == "addExc"){
      this.excPlaylist();
    } 
    if (command == "addEng"){
      this.engPlaylist();
    }
    if (command == "addFoc"){
      this.focPlaylist();
    }
    if (command == "addStr"){
      this.strPlaylist();
    }
    if (command == "addInt"){
      this.intPlaylist();
    }
    if (command == "addRel"){
      this.relPlaylist();
    }
  }

  //returns both request and access tokens
  getHashParams(){
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g;
    var q = window.location.hash.substring(1);
    e = r.exec(q)
    while(e){
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e= r.exec(q);
    }
    return hashParams
  }

  getPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
    .then((resp)=>{
      let timeRemaining = resp.item.duration_ms - resp.progress_ms + 2000
      var str = resp.item.uri
      var result = str.substring(str.indexOf("playlist:") + 9)
      var song = resp.item.uri
      clearInterval(this.interval)
      this.interval = setInterval(this.getPlaying, timeRemaining)
      this.setState({
        nowPlaying: {
          name: resp.item.name,
          albumArt: resp.item.album.images[0].url,
          userId: resp.device.id,
          uri: song
        },
        currentPlaylist: result,
        timer: timeRemaining
      })
      console.log(this.state.timer)
      console.log(resp)
    })
    .catch((error)=> this.setState({error}))
  }

  getCurrentPlaylist(){
    spotifyApi.getPlaylist(this.state.currentPlaylist)
    .then((resp)=>{
      return resp
    })
  }

  skipSong(){
    spotifyApi.skipToNext();
    this.getPlaying();
  }

  prevSong(){ 
    spotifyApi.skipToPrevious();
      return this.getPlaying();
  }

  addSongToPlaylist(){
    // console.log("current playlist = " + this.state.playlistID)
    // if (this.state.playlistId === ""){ //no current playlist, make a new one
    //   spotifyApi.getMe().then(function(data) {
    //     console.log(data.id)
    //     return data.id;
    //   })
    //   console.log("user id = " + this.state.userId)
    //   console.log(this.createNewPlaylist(this.state.userId, "music_genius"))
    // }

    // return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri])
    console.log("doing some spotify playlist add stuff...")
  }

  excPlaylist(){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri]);
  }

  engPlaylist(){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri]);
  }

  strPlaylist(){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri]);
  }

  relPlaylist(){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri]);
  }

  intPlaylist(){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri]);
  }

  focPlaylist(){
      return spotifyApi.addTracksToPlaylist("5TOheLold9VEiIUcljAQlK",  [this.state.nowPlaying.uri]);
  }

  createNewPlaylist(userId = "melted_snowman", playListName="New Playlist"){
    spotifyApi.createPlaylist(userId, { name: playListName})
    .then((resp)=>{
      console.log(resp)
    })
    .catch((error)=> this.setState({error}))
  }

  getUserId(){
    spotifyApi.getMe()
    .then((resp)=>{
      this.setState({
        userId: resp.id
      })
    })
    .catch((error)=> this.setState({error}))
  }

  playlistTracks(){
    spotifyApi.getPlaylistTracks("5TOheLold9VEiIUcljAQlK")
    .then((resp)=>{
      resp.items.map((song)=>{
        return this.state.playlistSongs.push(song.track.name)
      })
    })
    .catch((error)=> this.setState({error}))
  }

  componentDidMount(){
    this.getPlaying();
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
        {/* {this.handleCortexCommand(this.props.dataFromCortex)} */}
      </div>
    )
  }
}
