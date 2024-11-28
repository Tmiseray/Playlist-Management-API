
import Playlist from "./Playlist.js";

class Library {
    constructor() {
        this.playlists = [];
        this.songs = [];
    }

    addSongToLibrary(song) {
        const existingSong = this.songs.find(s => s.id === song.id)
        if (!existingSong) {
            this.songs.push(song);
        } else {
            console.log(`Song with ID ${song.id} already exists in the Library.`);
        }
    }

    addPlaylistToLibrary(playlistName) {
        const existingPlaylist = this.playlists.find(p => p.name === playlistName);

        if (existingPlaylist) {
            console.log(`Playlist "${playlistName}" already exists.`);
            return;
        }

        const newPlaylist = new Playlist(playlistName, this);
        this.playlists.push(newPlaylist);
        console.log(`Playlist "${newPlaylist.name}" added successfully.`); 
    }

    searchSongsInLibrary(searchTerm, attribute = 'title') {
        const results = this.songs.filter(song => {
            return song[attribute].toLowerCase().includes(searchTerm.toLowerCase());
        });

        if (results.length === 0) {
            console.log('No songs found for your search criteria.');
            return [];
        }
        return results;
    }

    getPlaylistFromLibrary(playlistName) {
        const playlist = this.playlists.find(p => p.name === playlistName);
        if (playlist && playlist instanceof Playlist) {
            return playlist;
        }
        return null;
    }

    updateSongInLibrary(songId, title=null, artist=null, genre=null) {
        const song = this.songs.find(s => s.id === songId);

        if (song) {
            song.title = title || song.title;
            song.artist = artist || song.artist;
            song.genre = genre || song.genre;
        }
        return song;
    }

    updatePlaylistInLibrary(oldName, newName) {
        const oldPlaylist = this.playlists.find(p => p.name === oldName);
        if (!oldPlaylist) {
            console.log(`Playlist "${oldName}" not found.`);
            return;
        }
        const existingPlaylist = this.playlists.find(p => p.name === newName);
        if (existingPlaylist) {
            console.log(`Playlist with the name "${newName}" already exists.`);
            return;
        }
        const newPlaylist = new Playlist(newName, this);

        oldPlaylist.songs.forEach(song => {
            newPlaylist.addSongToPlaylist(song.title, song.artist, song.genre);
        });

        this.removePlaylistFromLibrary(oldName);
        this.playlists.push(newPlaylist);

        console.log(`Playlist name changed from "${oldName}" to "${newPlaylist.name}".`);
        return newPlaylist;
    }

    removeSongFromLibrary(song) {
        const index = this.songs.findIndex(s => s.id === song.id);
        if (index !== -1) {
            this.songs.splice(index, 1);
            console.log(`Song "${song.title}" successfully removed from Library.`);
        } else {
            console.log(`Song not found.`);
        }
    }

    removePlaylistFromLibrary(playlistName) {
        const index = this.playlists.findIndex(p => p.name === playlistName);

        if (index !== -1) {
            this.playlists.splice(index, 1);
            console.log(`Playlist "${playlistName}" removed successfully.`);
        } else {
            console.log(`Playlist not found.`);
        }
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

    sortPlaylistsInLibrary() {
        this.playlists.sort();
    }

    sortLibrary(songSortAttributes = ['title']) {
        console.log('Before Sorting:', this.songs);

        this.sortPlaylistsInLibrary();

        this.playlists.forEach(playlist => {
            playlist.sortSongsInPlaylist(songSortAttributes);
        });

        this.sortSongsInLibrary(songSortAttributes);

        console.log('After Sorting:', this.songs);
    }

    displayLibrary() {
        const libraryData = {
            songs: this.songs,
            playlists: this.playlists.map(playlist => {
                return {
                    name: playlist.name,
                    songs: playlist.songs
                };
            })
        };

        console.log("\nSongs in the Library:");
        if (this.songs.length === 0) {
            console.log("Currently no songs in Library.");
        } else {
            this.songs.forEach(song => {
                console.log(`${song.id}. Song: ${song.title} by ${song.artist} (${song.genre})`);
            });
        }

        console.log("\nPlaylists in Library:");
        if (this.playlists.length === 0) {
            console.log("Currently no playlists in Library.");
        } else {
            this.playlists.forEach(playlistName => {
                this.playlists[playlistName].displayPlaylist();
            });
        }
        return libraryData;
    }
}

export default Library;