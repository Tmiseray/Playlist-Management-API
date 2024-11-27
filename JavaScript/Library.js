
import Playlist from "./Playlist.js";

class Library {
    constructor() {
        this.playlists = {};
        this.songs = {};
    }

    addSongToLibrary(song) {
        if (!this.songs[song.id]) {
            this.songs[song.id] = song;
        } else {
            console.log(`Song with ID ${song.id} already exists in the Library.`);
        }
    }

    addPlaylistToLibrary(playlistName) {
        if (this.playlists[playlistName]) {
            console.log(`Playlist "${playlistName}" already exists.`);
            return;
        }

        const newPlaylist = new Playlist(playlistName, this);
        this.playlists[playlistName] = newPlaylist;
        console.log(`Playlist "${playlistName}" added successfully.`); 
    }

    searchSongsInLibrary(searchTerm, attribute = 'title') {
        let results = [];

        searchTerm = searchTerm.toLowerCase();

        if (attribute === 'id') {
            results = Object.values(this.songs).filter(song => 
                song.id === parseInt(searchTerm));
        } else {
            results = Object.values(this.songs).filter(song => song[attribute].toLowerCase().includes(searchTerm));
        }

        if (results.length === 0) {
            console.log('No songs found for your search criteria.');
            return [];
        }
        return results;
    }

    getPlaylistFromLibrary(playlistName) {
        return this.playlists[playlistName] || null;
    }

    updateSongInLibrary(songId, title=null, artist=null, genre=null) {
        const song = this.songs[songId];

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
        this.playlists[newName].songs = playlist.songs;
        delete this.playlists[oldName];
    }

    removeSongFromLibrary(song) {
        if (this.songs[song[id]]) {
            delete this.songs[song[id]];
            console.log(`Song "${song[title]}" successfully removed from Library.`);
        } else {
            console.log(`Song not found.`);
        }
    }

    removePlaylistFromLibrary(playlistName) {
        if (this.playlists[playlistName]) {
            delete this.playlists[playlistName];
            console.log(`Playlist "${playlistName}" removed successfully.`);
        } else {
            console.log(`Playlist not found.`);
        }
    }

    sortSongsInLibrary(attributes = ['title']) {
        const sortedSongs = Object.values(this.songs).sort((a, b) => {
            for (let attribute of attributes) {
                if (a[attribute] < b[attribute]) return -1;
                if (a[attribute] > b[attribute]) return 1;
            }
            return 0;
        });

        this.songs = sortedSongs.reduce((acc, song) => {
            acc[song.id] = song;
            return acc;
        }, {});
    }

    sortPlaylistsInLibrary() {
        const sortedPlaylists = Object.keys(this.playlists).sort();
        this.playlists = sortedPlaylists.reduce((acc, playlistName) => {
            acc[playlistName] = this.playlists[playlistName];
            return acc;
        }, {});
    }


    sortLibrary(songSortAttributes = ['title']) {
        this.sortPlaylistsInLibrary();

        Object.keys(this.playlists).forEach(playlist => {
            playlist.sortSongsInPlaylist(songSortAttributes);
        });
        this.sortSongsInLibrary(songSortAttributes);
    }

    displayLibrary() {
        console.log("\nSongs in the Library:");
        if (Object.keys(this.songs).length === 0) {
            console.log("Currently no songs in Library.");
        } else {
            Object.values(this.songs).forEach(song => {
                console.log(`${song.id}. Song: ${song.title} by ${song.artist} (${song.genre})`);
            });
        }

        console.log("\nPlaylists in Library:");
        if (Object.keys(this.playlists).length === 0) {
            console.log("Currently no playlists in Library.");
        } else {
            Object.keys(this.playlists).forEach(playlistName => {
                // console.log(`Playlist: ${playlistName}`);
                this.playlists[playlistName].displayPlaylist();
            });
        }
    }
}

export default Library;