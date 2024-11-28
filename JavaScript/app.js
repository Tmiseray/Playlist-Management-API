import Song from './Song.js';
import Library from './Library.js';
import Playlist from './Playlist.js';
import e from 'express';

const app = e();
app.use(e.json());
const library = new Library();

// Welcome Message
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

    const song = library.searchSongsInLibrary(songId, 'id');
    if (!song) {
        return res.status(404).send(`Song with ID ${songId} not found.`);
    } else {
        const updatedSong = library.updateSongInLibrary(songId, title, artist, genre);
        console.log(updatedSong);
        res.status(200).send(`Song updated: ${updatedSong.title}, By: ${updatedSong.artist}, Genre: ${updatedSong.genre}`);
    }
});


// Remove/Delete Song from Library
app.delete('/library/songs/:attribute/:searchTerm', (req, res) => {
    const { attribute, searchTerm } = req.params;
    const results = library.searchSongsInLibrary(searchTerm, attribute);
    if (results.length === 0) {
        return res.status(404).send(`No songs found for ${attribute}: "${searchTerm}"`);
    } else if (results.length > 1) {
        return res.status(409).send('Library contains more than 1 song matching the criteria. Please search for the song to retrieve Song ID and try again.');
    } else {
        library.removeSongFromLibrary(results[0]);
        res.status(200).send('Song successfully removed from Library.');
    }
});


// Search/Get Song From Library
app.get('/library/songs/search/:attribute/:searchTerm', (req, res) => {
    const { attribute, searchTerm } = req.params;
    const results = library.searchSongsInLibrary(searchTerm, attribute);
    if (results.length === 0) {
        return res.status(404).send(`No songs found for ${attribute}: "${searchTerm}"`);
    } else {
        res.status(200).json(results);
    }
});


// Create New Playlist
app.post('/library/create-playlist', (req, res) => {
    console.log('Request body:', req.body);
    const { name } = req.body;
    const playlist = library.getPlaylistFromLibrary(name);
    if (!name) {
        return res.status(400).send('Playlist name is required.');
    } else if (playlist) { 
        return res.status(400).send('Playlist with this name already exists.');
    } else {
        library.addPlaylistToLibrary(name);
        console.log(`Playlist "${name}" created.`);
        res.status(200).send(`Playlist "${name}" created.`);
    }
});


// Update Playlist in Library
app.put('/library/update-playlist/:playlistName', (req, res) => {
    const { playlistName } = req.params;
    const { newName } = req.body;
    
    if (!newName) {
        return res.status(404).send('New playlist name is required.');
    }
    
    const playlist = library.getPlaylistFromLibrary(playlistName);
    if (!playlist) {
        return res.status(404).send(`No playlist named: ${playlistName}`);
    }
    
    const updatedPlaylist = library.updatePlaylistInLibrary(playlistName, newName);
    if (updatedPlaylist) {
        console.log(playlist, newName);
        res.status(200).send(`Playlist "${playlistName}" updated to "${updatedPlaylist.name}".`);
    }
});


// Delete Playlist from Library
app.delete('/library/playlists/:playlistName', (req, res) => {
    const { playlistName } = req.params;
    const playlist = library.getPlaylistFromLibrary(playlistName);
    
    if (!playlist) {
        return res.status(404).send(`No playlist named: ${playlistName}`);
    }
    
    library.removePlaylistFromLibrary(playlistName);
    res.status(200).send(`Playlist named "${playlistName}" removed from library.`);
});


// Get Playlist from Library
app.get('/library/playlists/:playlistName', (req, res) => {
    const { playlistName } = req.params;
    const playlist = library.getPlaylistFromLibrary(playlistName);
    if (!playlist) {
        return res.status(404).send(`No playlist named: ${playlistName}`);
    }

    if (!(playlist instanceof Playlist)) {
        return res.status(500).send(`Playlist is not an instance of Playlist class.`);
    }
    const playlistData = playlist.displayPlaylist();
    console.log(playlistData);
    res.status(200).json(playlistData);
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
    
    const playlist = library.getPlaylistFromLibrary(playlistName);
    if (!playlist) {
        return res.status(404).send('Playlist not found.');
    }
    
    playlist.addSongToPlaylist(title, artist, genre);
    console.log(playlistName, title, artist, genre);
    res.status(200).send(`New song added to playlist "${playlistName}": ${title}, By: ${artist}, Genre: ${genre}`);
});


// Update Song in Playlist
app.put('/:playlistName/update-song/:songId', (req, res) => {
    const { playlistName, songId } = req.params;
    const { title, artist, genre } = req.body;
    
    const playlist = library.getPlaylistFromLibrary(playlistName);
    if (!playlist) {
        return res.status(404).send('Playlist not found.');
    }
    
    const song = playlist.searchSongsInPlaylist(songId, 'id');
    if (!song) {
        return res.status(404).send(`Song with ID ${songId} not found.`);
    }
    
    const updatedSong = playlist.updateSongInPlaylist(songId, title, artist, genre);
    console.log(songId, title, artist, genre);
    res.status(200).send(`Song updated: ${updatedSong.title}, By: ${updatedSong.artist}, Genre: ${updatedSong.genre}`);
});


// Remove/Delete Song from Playlist
app.delete('/:playlistName/songs/:songId', (req, res) => {
    const { playlistName, songId } = req.params;
    const playlist = library.getPlaylistFromLibrary(playlistName);
    if (!playlist) {
        return res.status(404).send(`Playlist "${playlistName}" not found.`);
    }
    playlist.removeSongFromPlaylist(songId);
    res.status(200).send('Song successfully removed from playlist.');
});


// Search/Get Songs in Playlist
app.get('/:playlistName/songs/search/:attribute/:searchTerm', (req, res) => {
    const { playlistName, attribute, searchTerm } = req.params;
    const playlist = library.getPlaylistFromLibrary(playlistName);

    if (!playlist) {
        return res.status(404).send(`Playlist "${playlistName}" not found.`);
    }

    const results = playlist.searchSongsInPlaylist(searchTerm, attribute);
    if (results.length === 0) {
        return res.status(404).send(`No songs found for ${attribute}: "${searchTerm}" in playlist "${playlistName}"`);
    }
    console.log(results);
    res.status(200).json(results);
});


// Sort songs in Playlist by song name, genre, and artist
app.get('/:playlistName/songs/sort/:attribute', (req, res) => {
    const { playlistName, attribute } = req.params;
    const playlist = library.getPlaylistFromLibrary(playlistName);

    if (!playlist) {
        return res.status(404).send(`Playlist "${playlistName}" not found.`);
    }

    const attributes = attribute.split(',');
    playlist.sortSongsInPlaylist(attributes);

    const playlistData = playlist.displayPlaylist();
    res.status(200).send(`Playlist "${playlistName}" has been sorted by: ${attributes.join(', ')}\n${playlistData}`);
});


// Sort songs in Library by song name, genre, and artist
app.get('/library/sort/:attribute', (req, res) => {
    const { attribute } = req.params;
    const attributes = attribute.split(',');
    library.sortLibrary(attributes);
    const libraryData = library.displayLibrary();
    res.status(200).send(`Library has been sorted by: ${attributes.join(', ')}\n${JSON.stringify(libraryData)}`);
});


// Display Library
app.get('/library', (req, res) => {
    const libraryData = library.displayLibrary()
    res.status(200).json(libraryData);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));