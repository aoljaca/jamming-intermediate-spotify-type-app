const clientId = 'a86bca73cdb34eb18148930874702c7d'
const redirectUri = 'http://localhost:3000/'
let accessToken = undefined;
let expiration = undefined;
const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken
        }
        else {
            const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
            const expiration = window.location.href.match(/expires_in=([^&]*)/)
            if (accessTokenMatch && expiration) {
                accessToken = accessTokenMatch[1]
                const expiresIn = Number(expiration[1])
                window.setTimeout(() => accessToken='', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/' );
                return accessToken
            }  
            else {
                const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
                window.location = accessUrl;
            }
        }
    },
    search(term) {
        const accessToken = Spotify.getAccessToken()
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return []
            }
            else {
                return jsonResponse.tracks.items.map(track => {
                    return ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    })
                })
            }
        })
    }, 
    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken()
        const headers = {
            Authorization: `Bearer ${accessToken}`
        } 
        let userId; 
        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => {if (response.ok) {
            return response.json()
        }}
        ).then(jsonResponse => {
            console.log(headers)
            userId = jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({'name': name})
            }).then(response => {if (response.ok) {
                return response.json();
            }}
            ).then(jsonResponse => {
                // for some reason the above fetch is not working 
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1//users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                })
            })
        })
    }
}

export default Spotify