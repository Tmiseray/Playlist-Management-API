
import Song from "./Song.js";

class Playlist {
    constructor(name, library) {
        this.name = name;
        this.songs = [];
        this.library = library;
    }

    addSongToPlaylist(title, artist, genre) {
        let song = this.library.songs.find(song => song.title === title && song.artist === artist);

        if (!song) {
            song = new Song(title, artist, genre);
            this.library.addSongToLibrary(song);
            console.log(`New song "${song.title}" added to playlist and library.`);
        }

        const existingSong = this.songs.find(s => s.id === song.id);

        if (!existingSong) {
            this.songs.push(song);
            console.log(`Song "${song.title}" added to playlist.`);
        } else {
            console.log(`Song "${song.title}" already exists in this playlist.`);
        }
    }

    searchSongsInPlaylist(searchTerm, attribute = 'title') {
        const results = this.songs.filter(song => {
            return song[attribute].toLowerCase().includes(searchTerm.toLowerCase());
        });

        if (results.length === 0) {
            console.log('No songs found for your search criteria.');
            return [];
        }
        return results;
    }

    updateSongInPlaylist(songId, title=null, artist=null, genre=null) {
        const song = this.songs.find(s => s.id === songId);

        if (song) {
            song.title = title || song.title;
            song.artist = artist || song.artist;
            song.genre = genre || song.genre;
            console.log(`Song with ID ${songId} updated successfully.`);
        } else {
            console.log(`Song with ID ${songId} not found in playlist.`);
        }
        return song;
    }

    removeSongFromPlaylist(songId) {
        const index = this.songs.findIndex(s => s.id === songId);

        if (index !== -1) {
            this.songs.splice(index, 1);
            console.log(`Song with ID ${songId} removed from playlist.`);
        } else {
            console.log(`Song with ID ${songId} not found in playlist.`);
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

    displayPlaylist() {
        const playlistData = {
            name: this.name,
            songs: this.songs
        };

        console.log(`Playlist: ${this.name}`);
        if (this.songs.length === 0) {
            console.log('\tPlaylist currently has no songs.');
        } else {
            this.songs.forEach(song => {
                song.showSongDetails();
            });
        }
        return playlistData;
    }
}

export default Playlist;