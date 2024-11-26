import Song from './Song.js';
import Library from './Library.js';
import Playlist from './Playlist.js';
import e from 'express';

const app = e();
app.use(e.json());
const library = new Library();

app.get('/', (req, res) => {
    const welcomeMessage = "Welcome to the Digital Library!! \nHere you can create you're own Library of Playlists! \nFill them with any and all beats of your heart and soul!"
    console.log(welcomeMessage);
    res.status(200).send(welcomeMessage);
});


// Create Song in Library
app.post('/library/add-song', (req, res) => {
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

    const song = new Song(title, artist, genre);
    library.addSongToLibrary(song);
    console.log(song);
    res.status(200).send(`Song added to library: ${title}, By: ${artist}, Genre: ${genre}`);
});


// Update Song in Library
app.put('/library/update-song/:songId', (req, res) => {
    const { songId } = req.params;
    const { title, artist, genre } = req.body;

    const song = library.songs.find(song => song.id === parseInt(songId));
    if (!song) {
        return res.status(404).send(`Song with ID ${songId} not found.`);
    }

    library.updateSongInLibrary(songId, title, artist, genre);
    console.log(song);
    res.status(200).send(`Song updated: ${song.title}, By: ${song.artist}, Genre: ${song.genre}`);
});


// Remove/Delete Song from Library
app.delete('/library/:songIdentifier', (req, res) => {
    const { songIdentifier } = req.params;
    library.removeSongFromLibrary(songIdentifier);
    res.status(200).send('Song successfully removed from Library.');
});


// Search/Get Song From Library
app.get('/library/:songIdentifier', (req, res) => {
    const { songIdentifier } = req.params;
    const song = library.getSongByAttribute(songIdentifier);
    const songDetails = song.showSongDetails();
    console.log(songDetails);
    res.status(200).send(`Song Details - ID: ${songDetails.id}, Title: ${songDetails.title}, Artist: ${songDetails.artist}, Genre: ${songDetails.genre}`);
});


// Create New Playlist
app.post('/create-playlist', (req, res) => {
    console.log('Request body:', req.body);
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Playlist name is required.');
    }
    if (library.playlists[name]) { 
        return res.status(400).send('Playlist with this name already exists.');
    }
    const playlist = new Playlist(name);
    library.addPlaylistToLibrary(playlist);
    console.log(`Playlist "${name}" created.`);
    res.status(200).send(`Playlist "${name}" created.`);
});


// Get Playlist from Library
app.get('/library/:playlistName', (req, res) => {
    const { playlistName } = req.params;
    const playlist = Object.keys(library.playlists).find(playlistName);
    if (!playlist) {
        return res.status(404).send(`No playlist named: ${playlistName}`);
    }
    console.log(playlist);
    res.status(200).send(`Displaying Playlist: ${playlistName}`);
    playlist.displayPlaylist();
});


// Update Playlist in Library
app.put('/library/:playlistName', (req, res) => {
    const { playlistName } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(404).send('New playlist name is required.');
    }

    const playlist = library.playlists[playlistName];
    if (!playlist) {
        return res.status(404).send(`No playlist named: ${playlistName}`);
    }

    library.updatePlaylistInLibrary(playlistName, newName);

    console.log(playlistName, playlist, newName);
    res.status(200).send(`Playlist "${playlistName}" updated to "${newName}".`);
});


// Delete Playlist from Library
app.delete('/library/:playlistName', (req, res) => {
    const { playlistName } = req.params;
    const playlist = library.playlists[playlistName];

    if (!playlist) {
        return res.status(404).send(`No playlist named: ${playlistName}`);
    }

    library.removePlaylistFromLibrary(playlistName);
    res.status(200).send(`Playlist named "${playlistName}" removed from library.`);
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

    playlist.addSongToPlaylist(title, artist, genre);
    console.log(playlistName, title, artist, genre);
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

    playlist.updateSongInLibrary(songId, title, artist, genre);
    console.log(songId, title, artist, genre);
    res.status(200).send(`Song updated: ${song.title}, By: ${song.artist}, Genre: ${song.genre}`);
});


// Remove/Delete Song from Playlist
app.delete('/:playlistName/:songIdentifier', (req, res) => {
    const { playlistName, songIdentifier } = req.params;
    const playlist = library.playlists[playlistName];
    if (!playlist) {
        return res.status(404).send(`Playlist "${playlistName}" not found.`);
    }
    playlist.removeSongFromPlaylist(songIdentifier);
    console.log(`Song with ID "${songId}" removed from playlist "${playlistName}".`);
    res.status(200).send('Song successfully removed from playlist.');
});


// Sort songs in Playlist by song name, genre, and artist
app.get('/:playlistName/:attribute', (req, res) => {
    const { playlistName, attribute } = req.params;
    playlistName.sortSongsInPlaylist(attribute);
});


// Sort songs in Library by song name, genre, and artist
app.get('/library/:attribute', (req, res) => {
    const { attribute } = req.params;
    library.sortLibrary(attribute);
    res.status(200).send('Library has been sorted successfully.');
});


// Display Library
app.get('/library', (req, res) => {
    res.status(200).send(library.displayLibrary());
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));