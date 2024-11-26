import Song from "./Song.js";

class Playlist {
    constructor(name) {
        this.name = name;
        this.songs = [];
    }

    addSongToPlaylist(song) {
        this.songs.push(song);
    }

    updateSongInPlaylist(songId, title, artist, genre) {
        const song = this.songs.find(song => song.id === parseInt(songId));

        if (song) {
            song.title = title || song.title;
            song.artist = artist || song.artist;
            song.genre = genre || song.genre;
        }
    }

    removeSongFromPlaylist(songIdentifier) {
        if (typeof songIdentifier === 'number') {
            this.songs = this.songs.filter(song => song.id !== parseInt(songIdentifier));
        } else if (typeof songIdentifier === 'string') {
            this.songs = this.songs.filter(song => song.title.toLowerCase() === songIdentifier.toLowerCase());
        } else {
            console.log('Invalid identifier. Please provide either a song ID (number) or song title.');
        }
    }

    sortSongsInPlaylist(attributes = ['title']) {
        this.songs.sort((a, b) => {
            for (let attribute of attributes) {
                if (a[attribute] < b[attribute]) return -1;
                if (a[attribute] > b[attribute]) return 1;
            }
            return 0;
        });
    }

    isPlaylistEmpty() {
        return this.songs.length === 0;
    }

    displayPlaylist() {
        if (this.isPlaylistEmpty()) {
            console.log('Playlist currently has no songs.');
        } else {
            console.log(`Playlist: ${this.name}\nSongs:`);
            this.songs.forEach(song => {
                // let songDetails = song.showSongDetails();
                // return songDetails;
                song.showSongDetails();
            });
        }
    }
}

export default Playlist;