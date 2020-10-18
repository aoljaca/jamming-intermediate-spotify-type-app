import React from 'react';
import './App.css';
import { render } from '@testing-library/react';
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import SearchBar from '../SearchBar/SearchBar'
import Spotify from '../../utils/Spotify'
// Why does the page refresh twice when you search (the url changes)
// Why does the no token error message pop up when you try to add to playlist 
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: 'My Playlist'
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    else {
      this.setState({
        playListTracks: this.state.playlistTracks.push(track)
      }
      )
    }
  }
  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }
  removeTrack(track) {
    const playListTracks = this.state.playListTracks.filter(track_real => track_real.id != track.id)
    this.setState({
      'playlistTracks': playListTracks
    })
  }
  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }
  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({'searchResults': searchResults})
    })
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} tracks={this.state.searchResults}/>
            <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} searchResults={this.state.searchResults} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App

