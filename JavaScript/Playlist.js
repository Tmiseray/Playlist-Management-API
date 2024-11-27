
import Song from "./Song.js";

class Playlist {
    constructor(name, library) {
        this.name = name;
        this.songs = {};
        this.library = library;
    }

    addSongToPlaylist(title, artist, genre) {
        let song = Object.values(this.library.songs).find(song => song.title === title && song.artist === artist);

        if (!song) {
            song = new Song(title, artist, genre);
            this.library.addSongToLibrary(song);
            console.log(`New song "${song.title}" added to playlist and library.`);
        }

        if (!this.songs[song.id]) {
            this.songs[song.id] = song;
            console.log(`Song "${song.title}" added to playlist.`);
        } else {
            console.log(`Song "${song.title}" already exists in this playlist.`);
        }
    }

    searchSongsInPlaylist(searchTerm, attribute = 'title') {
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

    updateSongInPlaylist(songId, title=null, artist=null, genre=null) {
        const song = this.songs[songId];

        if (song) {
            song.title = title || song.title;
            song.artist = artist || song.artist;
            song.genre = genre || song.genre;
            console.log(`Song with ID ${songId} updated successfully.`);
        } else {
            console.log(`Song with ID ${songId} not found in playlist.`);
        }
    }

    removeSongFromPlaylist(songId) {
        if (this.songs[songId]) {
            delete this.songs[songId];
            console.log(`Song with ID ${songId} removed from playlist.`);
        } else {
            console.log(`Song with ID ${songId} not found in playlist.`);
        }
    }

    sortSongsInPlaylist(attributes = ['title']) {
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

    displayPlaylist() {
        console.log(`Playlist: ${this.name}`);
        if (Object.keys(this.songs).length === 0) {
            console.log('\tPlaylist currently has no songs.');
        } else {
            Object.values(this.songs).forEach(song => {
                song.showSongDetails();
            });
        }
    }
}

export default Playlist;