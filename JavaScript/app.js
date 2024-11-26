const express = require('express');
const app = express();

class Song {
    constructor(title, artist, genre) {
        this.id = Song.idCounter++;
        this.title = title;
        this.artist = artist;
        this.genre = genre;
    }

    showDetails() {
        console.log(`${this.id}. ${this.title}, By: ${this.artist} \nGenre: ${this.genre}`);
    }
}
Song.idCounter = 1;

class Playlist {
    constructor(name) {
        this.name = name;
        this.songs = [];
    }

    addSong(title, artist, genre) {
        const song = new Song(title, artist, genre);
        this.songs.push(song);
    }

    removeSong(songId) {
        this.songs = this.songs.filter(song => song.id !== parseInt(songId));
    }

    isEmpty() {
        return this.songs.length === 0;
    }

    displayPlaylist() {
        if (this.isEmpty()) {
            console.log('Playlist currently has no songs.');
        } else {
            this.songs.forEach(song => {
                song.showDetails();
            });
        }
    }
}

class Library {
    constructor() {
        this.playlists = {};
    }

    addPlaylist(name) {
        const newPlaylist = new Playlist(name);
        this.playlists[name] = newPlaylist;
    }

    removePlaylist(name) {
        delete this.playlists[name];
    }

    displayLibrary() {
        if (Object.keys(this.playlists).length === 0) {
            console.log('Library is currently empty.')
        } else {
            Object.values(this.playlists).forEach(playlist => playlist.displayPlaylist());
        }
    }
}

app.use(express.json());

const library = new Library();

app.get('/', (req, res) => {
    const welcomeMessage = "Welcome to the Digital Library!! \nHere you can create you're own Library of Playlists! \nFill them with any and all beats of your heart and soul!"
    console.log(welcomeMessage);
    res.status(200).send(welcomeMessage);
});

// Create New Playlist
app.post('/create-playlist', (req, res) => {
    console.log('Request body:', req.body);
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Playlist name is required.');
    }

    library.addPlaylist(name);
    res.status(200).send(`Playlist "${name}" created.`);
});

// Add New Song to Playlist
app.post('/:playlistName/add-song', (req, res) => {
    const { playlistName } = req.params;
    const { title, artist, genre } = req.body;

    if (!title || title.length <= 3) {
        return res.status(404).send('Song title is required and must be at least 3 characters long.');
    }
    if (!artist || artist.length <= 3) {
        return res.status(404).send('Artist is required and must be at least 3 characters long.');
    }
    if (!genre) {
        return res.status(404).send('Song genre is required.');
    }

    const playlist = library.playlists[playlistName];
    if (!playlist) {
        return res.status(404).send('Playlist not found.');
    }

    playlist.addSong(title, artist, genre);
    res.status(200).send(`New song added to playlist "${playlistName}": ${title}, By: ${artist}, Genre: ${genre}`);
});

// Update Song in Playlist
app.put('/:playlistName/:songId', (req, res) => {
    const { playlistName, songId } = req.params;
    const { title, artist, genre } = req.body;

    const playlist = library.playlists[playlistName];
    if (!playlist) {
        return res.status(404).send('Playlist not found.');
    }

    const song = playlist.songs.find(song => song.id === parseInt(songId));
    if (!song) {
        return res.status(404).send(`Song with ID ${songId} not found.`);
    }

    if (title) song.title = title;
    if (artist) song.artist = artist;
    if (genre) song.genre = genre;

    res.status(200).send(`Song updated: ${song.title}, By: ${song.artist}, Genre: ${song.genre}`);
});

// Remove Song from Playlist



// Search/Get Song



// Sort Songs in Playlist by name, artist, genre



// Get Playlist from Library



// Update Playlist in Library



// Delete Playlist from Library


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));