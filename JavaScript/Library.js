import Playlist from "./Playlist.js";
// import Song from "./Song.js";

class Library {
    constructor() {
        this.playlists = {};
        this.songs = [];
    }

    addSongToLibrary(song) {
        this.songs.push(song);
    }

    addPlaylistToLibrary(name) {
        if (!this.playlists[name]) {
            const newPlaylist = new Playlist(name);
            this.playlists[name] = newPlaylist;
        }
        console.log(this.playlists); 
    }

    updateSongInLibrary(songId, title=null, artist=null, genre=null) {
        const song = this.songs.find(song => song.id === parseInt(songId));

        if (song) {
            song.title = title || song.title;
            song.artist = artist || song.artist;
            song.genre = genre || song.genre;
        }
    }

    updatePlaylistInLibrary(oldName, newName) {
        const playlist = this.playlists[oldName];
        if (!playlist) {
            console.log(`Playlist "${oldName}" not found.`);
            return;
        }
        this.playlists[newName] = playlist;
        delete this.playlists[oldName]
    }

    removeSongFromLibrary(songIdentifier) {
        if (typeof songIdentifier === 'number') {
            this.songs = this.songs.filter(song => song.id !== songIdentifier);
        } else if (typeof songIdentifier === 'string') {
            this.songs = this.songs.filter(song => song.title.toLowerCase() !== songIdentifier.toLowerCase());
        } else {
            console.log('Invalid identifier. Please provide either a song ID (number) or song title.');
        }
    }

    removePlaylistFromLibrary(name) {
        delete this.playlists[name];
    }

    sortPlaylistsInLibrary() {
        const sortedPlaylists = Object.keys(this.playlists)
            .sort()
            .reduce((acc, key) => {
                acc[key] = this.playlists[key];
                return acc;
            }, {});
        this.playlists = sortedPlaylists;
    }

    sortSongsInLibrary(attributes = ['title']) {
        this.songs.sort((a, b) => {
            for (let attribute of attributes) {
                if (a[attribute] < b[attribute]) return -1;
                if (a[attribute] > b[attribute]) return 1;
            }
            return 0;
        });
    }

    sortLibrary(songSortAttributes = ['title']) {
        this.sortPlaylistsInLibrary();

        Object.values(this.playlists).forEach(playlist => {
            playlist.sortSongsInPlaylist(songSortAttributes);
        });
        this.sortSongsInLibrary(songSortAttributes);
    }

    getSongByAttribute(songIdentifier) {
        let results = [];
        if (isNaN(songIdentifier)) {
            results = this.songs.filter(song => song.title.toLowerCase() === songIdentifier.toLowerCase());
        } else {
            results = this.songs.filter(song => song.id === parseInt(songIdentifier));
        }

        if (results.length === 0) {
            console.log('No songs found for your search criteria.');
            return null;
        }
        return results[0]; 
    }

    getPlaylistFromLibrary(playlistName) {
        return this.playlists[playlistName] ? this.playlists[playlistName].songs : [];
    }

    displayLibrary() {
        console.log("Songs in the Library:");
        this.songs.forEach(song => {
            console.log(`Song: ${song.title} by ${song.artist} (${song.genre})`);
        });

        console.log("\nPlaylists:");
        Object.entries(this.playlists).forEach(([playlistName, playlist]) => {
            console.log(`Playlist: ${playlistName}`);
            playlist.displayPlaylist();
        });
    }
}

export default Library;