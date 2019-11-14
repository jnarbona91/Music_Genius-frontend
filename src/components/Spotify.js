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
      search: "",
      // int is a keyword, so I changed it to intt
      // also I made each entry an object so we can store both name and ID
      // TODO fix int to intt in other files??
      playlists: {foc: {}, str: {}, eng: {}, exc: {}, intt: {}, rel: {}},
      /*
      focPlaylist: "",
      strPlaylist: "",
      engPlaylist: "",
      excPlaylist: "",
      intPlaylist: "",
      relPlaylist: "",
      */
    }
    this.getPlaying = this.getPlaying.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.publish = this.publish.bind(this);
  }

  handleCortexCommand(command){
    console.log("[Spotify] received message: " + command)

    if(command.startsWith('add')) { 
        let plName = command.substring(3);  //strip the add
        console.log("adding to pl " + plName);
        this.addPlaylist(plName);
    }
    /* MSB: No longer needed
    if (command === "addExc"){
      this.excPlaylist();
    } 
    if (command === "addEng"){
      this.engPlaylist();
    }
    if (command === "addFoc"){
      this.focPlaylist();
    }
    if (command === "addStr"){
      this.strPlaylist();
    }
    if (command === "addInt"){
      this.intPlaylist();
    }
    if (command === "addRel"){
      this.relPlaylist();
    }
    */
    else if (command === "skip"){  // MSB: note added "else" to make it faster
      this.skipSong();
    }
  }

  tellCortex = (command) => {
    console.log("[Spotify] sending: " + command)
    this.props.parentCallback(command);
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

  setPlaylist(plName){
    console.log("plName = ",plName);
    console.log("playlist object = " + this.state.playlists[plName]);
    spotifyApi.getUserPlaylists(this.state.userId, {limit: 50})
    .then((resp)=>{
      console.log(resp.items)
      let songNames = resp.items.map(function(item) {
          return { name: item.name }
      });
      let playlistNames = songNames.find(e => e.name === this.state.search)
      let fullPlaylist = resp.items.find(e => e.name === this.state.search)
      // this.setState({playlists[plName]:
      //                {id: fullPlaylist.id, name: fullPlaylist.name}});

      this.setState(state => {
        state.playlists[plName].id = fullPlaylist.id
        state.playlists[plName].name = fullPlaylist.name
        return state
      })
                    

      console.log(fullPlaylist.id)
      console.log(songNames)
      console.log(playlistNames)
      console.log(this.state.search)
      return resp
    })
  }

  /* MSB: No longer needed
  setFocPlaylist(){
    spotifyApi.getUserPlaylists(this.state.userId, {limit: 50})
    .then((resp)=>{
      console.log(resp.items)
      let songNames = resp.items.map(function(item) { return { name: item.name }})
      let playlistNames = songNames.find(e => e.name === this.state.search)
      let fullPlaylist = resp.items.find(e => e.name === this.state.search)
      this.setState({focPlaylist: fullPlaylist.id})
      console.log(fullPlaylist.id)
      console.log(songNames)
      console.log(playlistNames)
      console.log(this.state.search)
      return resp
    })
  }

  setExcPlaylist(){
    spotifyApi.getUserPlaylists(this.state.userId, {limit: 50})
    .then((resp)=>{
      let songNames = resp.items.map(function(item) { return { name: item.name }})
      let playlistNames = songNames.find(e => e.name === this.state.search)
      let fullPlaylist = resp.items.find(e => e.name === this.state.search)
      console.log("setting exc playlist to " + fullPlaylist.name);
      this.setState({excPlaylist: fullPlaylist.id})
      return resp
    })
  }

  setEngPlaylist(){
    spotifyApi.getUserPlaylists(this.state.userId, {limit: 50})
    .then((resp)=>{
      let songNames = resp.items.map(function(item) { return { name: item.name }})
      let playlistNames = songNames.find(e => e.name === this.state.search)
      let fullPlaylist = resp.items.find(e => e.name === this.state.search)
      this.setState({engPlaylist: fullPlaylist.id})
      return resp
    })
  }

  setStrPlaylist(){
    spotifyApi.getUserPlaylists(this.state.userId, {limit: 50})
    .then((resp)=>{
      let songNames = resp.items.map(function(item) { return { name: item.name }})
      let playlistNames = songNames.find(e => e.name === this.state.search)
      let fullPlaylist = resp.items.find(e => e.name === this.state.search)
      this.setState({strPlaylist: fullPlaylist.id})
      return resp
    })
  }

  setIntPlaylist(){
    spotifyApi.getUserPlaylists(this.state.userId, {limit: 50})
    .then((resp)=>{
      let songNames = resp.items.map(function(item) { return { name: item.name }})
      let playlistNames = songNames.find(e => e.name === this.state.search)
      let fullPlaylist = resp.items.find(e => e.name === this.state.search)
      this.setState({intPlaylist: fullPlaylist.id})
      return resp
    })
  }

  setRelPlaylist(){
    spotifyApi.getUserPlaylists(this.state.userId, {limit: 50})
    .then((resp)=>{
      let songNames = resp.items.map(function(item) { return { name: item.name }})
      let playlistNames = songNames.find(e => e.name === this.state.search)
      let fullPlaylist = resp.items.find(e => e.name === this.state.search)
      this.setState({relPlaylist: fullPlaylist.id})
      return resp
    })
  }
  */

  skipSong(){
    spotifyApi.skipToNext()
    .then(()=>{
      this.getPlaying()
    })
    this.tellCortex("reset");
  }

  prevSong(){ 
    spotifyApi.skipToPrevious();
    this.tellCortex("reset");
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

  addPlaylist(plName) {
      console.log("Adding to ", plName, "playlist: ",
                  this.state.playlists[plName].name);
      if(this.state.playlists[plName] === null) { 
        console.log("No playlist set for ", plName);
        return;
      }
      return spotifyApi.addTracksToPlaylist(this.state.playlists[plName].id,
                                            [this.state.nowPlaying.uri]);
  }

  /* MSB: no longer needed
  excPlaylist(){
      return spotifyApi.addTracksToPlaylist(this.state.excPlaylist,  [this.state.nowPlaying.uri]);
  }

  engPlaylist(){
      return spotifyApi.addTracksToPlaylist(this.state.engPlaylist,  [this.state.nowPlaying.uri]);
  }

  strPlaylist(){
      return spotifyApi.addTracksToPlaylist(this.state.strPlaylist,  [this.state.nowPlaying.uri]);
  }

  relPlaylist(){
      return spotifyApi.addTracksToPlaylist(this.state.relPlaylist,  [this.state.nowPlaying.uri]);
  }

  intPlaylist(){
      return spotifyApi.addTracksToPlaylist(this.state.intPlaylist,  [this.state.nowPlaying.uri]);
  }

  focPlaylist(){
      return spotifyApi.addTracksToPlaylist(this.state.focPlaylist,  [this.state.nowPlaying.uri]);
  }
  */

  createNewPlaylist(userId = this.state.userId, playListName=this.state.search){
    spotifyApi.createPlaylist(userId, { name: playListName})
    .then((resp)=>{
      console.log(resp)
    })
    .catch((error)=> this.setState({error}))
  }
  
  getUserId(){
    spotifyApi.getMe()
    .then((resp)=>{
      console.log(resp.display_name)
      this.setState({
        userId: resp.display_name
      })
    })
    .catch((error)=> this.setState({error}))
  }

  playlistTracks(){
    spotifyApi.getPlaylistTracks(this.state.playLists)
    .then((resp)=>{
      resp.items.map((song)=>{
        return this.state.playlistSongs.push(song.track.name)
      })
    })
    .catch((error)=> this.setState({error}))
  }

  componentDidMount(){
    this.getPlaying();
    this.getUserId();
  }

  handleChange({target}){
    this.setState({
      [target.name]: target.value
    })
  }

  publish(){
    console.log(this.state.search)
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
              <button onClick={()=> this.createNewPlaylist()}>
                Create Playlist
              </button>
            </div>
            <div>
              <input type= "text" name="search" placeholder="Search Playlists" value={this.state.search} onChange={this.handleChange}/>
              <button onClick={this.publish}>Search</button>
            </div>
            <div>
              <button onClick={()=> this.setPlaylist('foc')}>
                Set As Focus Playlist
              </button>
            </div>
            <div>
              <button onClick={()=> this.setPlaylist('eng')}>
                Set as Eng Playlist
              </button>
            </div>
            <div>
              <button onClick={()=> this.setPlaylist('exc')}>
                Set as Exc Playlist
              </button>
            </div>
            <div>
              <button onClick={()=> this.setPlaylist('str')}>
                Set as Str Playlist
              </button>
            </div>
            <div>
              <button onClick={()=> this.setPlaylist('intt')}>
                Set as Int Playlist
              </button>
            </div>
            <div>
              <button onClick={()=> this.setPlaylist('rel')}>
                Set as Rel Playlist
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
