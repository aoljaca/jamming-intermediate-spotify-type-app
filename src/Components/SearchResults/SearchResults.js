import TrackList from '../TrackList/Tracklist'
import './SearchResults.css'
import React from 'react'
class SearchResults extends React.Component {
    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList searchResults={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false} tracks={this.props.tracks}/>
            </div>
        )
    }
}

export default SearchResults