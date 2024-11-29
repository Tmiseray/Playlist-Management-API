from flask import Flask, request, jsonify
from Library import Library
from Song import Song
from Playlist import Playlist

app = Flask(__name__)
library = Library()

# Welcome Message
@app.route('/', methods=['GET'])
def welcome():
    welcome_message = (
        "Welcome to the Digital Library!!\n"
        "Here you can create you're own Library of Playlists!\n"
        "Fill them with any and all beats of your heart and soul!"
    )
    print(welcome_message)
    return welcome_message, 200


# Create Song in Library
@app.route('/library/add-song', methods=['POST'])
def add_song_to_library():
    data = request.get_json()
    title = data.get('title')
    artist = data.get('artist')
    genre = data.get('genre')

    if not title or len(title) <= 3:
        return 'Song title is required and must be at least 3 characters long.', 404
    if not artist or len(artist) <= 3:
        return 'Artist is required and must be at least 3 characters long.', 404
    if not genre:
        return 'Song genre is required.', 404

    song = Song(title, artist, genre)
    library.add_song_to_library(song)
    print(song)
    return f'Song added to library: {title}, By: {artist}, Genre: {genre}', 200


# Update Song in Library
@app.route('/library/update-song/<int:song_id>', methods=['PUT'])
def update_song_in_library(song_id):
    data = request.get_json()
    title = data.get('title')
    artist = data.get('artist')
    genre = data.get('genre')

    song = library.search_songs_in_library(str(song_id), 'id')
    if not song:
        return f'Song with ID {song_id} not found.', 404

    updated_song = library.update_song_in_library(song_id, title, artist, genre)
    print(updated_song)
    return f'Song updated: {updated_song.title}, By: {updated_song.artist}, Genre: {updated_song.genre}', 200


# Remove/Delete Song from Library
@app.route('/library/songs/<string:attribute>/<string:search_term>', methods=['DELETE'])
def remove_song_from_library(attribute, search_term):
    results = library.search_songs_in_library(search_term, attribute)
    if not results:
        return f'No songs found for {attribute}: "{search_term}"', 404
    elif len(results) > 1:
        return 'Library contains more than 1 song matching the criteria. Please search for the song to retrieve Song ID and try again.', 409
    else:
        library.remove_song_from_library(results[0])
        return 'Song successfully removed from Library.', 200


# Search/Get Song From Library
@app.route('/library/songs/search/<string:attribute>/<string:search_term>', methods=['GET'])
def search_song_in_library(attribute, search_term):
    results = library.search_songs_in_library(search_term, attribute)
    if not results:
        return f'No songs found for {attribute}: "{search_term}"', 404
    return jsonify(results), 200


# Create New Playlist
@app.route('/library/create-playlist', methods=['POST'])
def create_playlist():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return 'Playlist name is required.', 400

    playlist = library.get_playlist_from_library(name)
    if playlist:
        return 'Playlist with this name already exists.', 400

    library.add_playlist_to_library(name)
    print(f'Playlist "{name}" created.')
    return f'Playlist "{name}" created.', 200


# Update Playlist in Library
@app.route('/library/update-playlist/<string:playlist_name>', methods=['PUT'])
def update_playlist(playlist_name):
    data = request.get_json()
    new_name = data.get('newName')

    if not new_name:
        return 'New playlist name is required.', 404

    playlist = library.get_playlist_from_library(playlist_name)
    if not playlist:
        return f'No playlist named: {playlist_name}', 404

    updated_playlist = library.update_playlist_in_library(playlist_name, new_name)
    if updated_playlist:
        print(updated_playlist)
        return f'Playlist "{playlist_name}" updated to "{updated_playlist.name}".', 200


# Delete Playlist from Library
@app.route('/library/playlists/<string:playlist_name>', methods=['DELETE'])
def remove_playlist(playlist_name):
    playlist = library.get_playlist_from_library(playlist_name)
    if not playlist:
        return f'No playlist named: {playlist_name}', 404

    library.remove_playlist_from_library(playlist_name)
    return f'Playlist named "{playlist_name}" removed from library.', 200


# Get Playlist from Library
@app.route('/library/playlists/<string:playlist_name>', methods=['GET'])
def get_playlist_from_library(playlist_name):
    playlist = library.get_playlist_from_library(playlist_name)
    if not playlist:
        return f'No playlist named: {playlist_name}', 404

    if not isinstance(playlist, Playlist):
        return f'Playlist is not an instance of Playlist class.', 500

    playlist_data = playlist.display_playlist()
    print(playlist_data)
    return jsonify(playlist_data), 200


# Add New Song to Playlist
@app.route('/<string:playlist_name>/add-song', methods=['POST'])
def add_song_to_playlist(playlist_name):
    data = request.get_json()
    title = data.get('title')
    artist = data.get('artist')
    genre = data.get('genre')

    if not title or len(title) <= 3:
        return 'Song title is required and must be at least 3 characters long.', 404
    if not artist or len(artist) <= 3:
        return 'Artist is required and must be at least 3 characters long.', 404
    if not genre:
        return 'Song genre is required.', 404

    playlist = library.get_playlist_from_library(playlist_name)
    if not playlist:
        return 'Playlist not found.', 404

    playlist.add_song_to_playlist(title, artist, genre)
    print(f'{playlist_name} - {title}, {artist}, {genre}')
    return f'New song added to playlist "{playlist_name}": {title}, By: {artist}, Genre: {genre}', 200


# Update Song in Playlist
@app.route('/<string:playlist_name>/update-song/<int:song_id>', methods=['PUT'])
def update_song_in_playlist(playlist_name, song_id):
    data = request.get_json()
    title = data.get('title')
    artist = data.get('artist')
    genre = data.get('genre')

    playlist = library.get_playlist_from_library(playlist_name)
    if not playlist:
        return 'Playlist not found.', 404

    song = playlist.search_songs_in_playlist(song_id, 'id')
    if not song:
        return f'Song with ID {song_id} not found.', 404

    updated_song = playlist.update_song_in_playlist(song_id, title, artist, genre)
    print(f'{song_id} - {title}, {artist}, {genre}')
    return f'Song updated: {updated_song.title}, By: {updated_song.artist}, Genre: {updated_song.genre}', 200


# Remove/Delete Song from Playlist
@app.route('/<string:playlist_name>/songs/<int:song_id>', methods=['DELETE'])
def remove_song_from_playlist(playlist_name, song_id):
    playlist = library.get_playlist_from_library(playlist_name)
    if not playlist:
        return f'Playlist "{playlist_name}" not found.', 404

    playlist.remove_song_from_playlist(song_id)
    return 'Song successfully removed from playlist.', 200


# Search/Get Songs in Playlist
@app.route('/<string:playlist_name>/songs/search/<string:attribute>/<string:search_term>', methods=['GET'])
def search_songs_in_playlist(playlist_name, attribute, search_term):
    playlist = library.get_playlist_from_library(playlist_name)

    if not playlist:
        return f'Playlist "{playlist_name}" not found.', 404

    results = playlist.search_songs_in_playlist(search_term, attribute)
    if not results:
        return f'No songs found for {attribute}: "{search_term}" in playlist "{playlist_name}"', 404

    return jsonify(results), 200


# Sort songs in Playlist by song name, genre, and artist
@app.route('/<string:playlist_name>/songs/sort/<string:attribute>', methods=['GET'])
def sort_songs_in_playlist(playlist_name, attribute):
    playlist = library.get_playlist_from_library(playlist_name)

    if not playlist:
        return f'Playlist "{playlist_name}" not found.', 404

    attributes = attribute.split(',')
    playlist.sort_songs_in_playlist(attributes)

    playlist_data = playlist.display_playlist()
    return f'Playlist "{playlist_name}" has been sorted by: {", ".join(attributes)}\n{playlist_data}', 200


# Sort songs in Library by song name, genre, and artist
@app.route('/library/sort/<string:attribute>', methods=['GET'])
def sort_songs_in_library(attribute):
    attributes = attribute.split(',')
    library.sort_library(attributes)
    library_data = library.display_library()
    return f'Library has been sorted by: {", ".join(attributes)}\n{library_data}', 200


# Display Library
@app.route('/library', methods=['GET'])
def display_library():
    library_data = library.display_library()
    return jsonify(library_data), 200


if __name__ == '__main__':
    app.run(port=3000)
