from Song import Song

class Playlist:
    def __init__(self, name, library):
        self.name = name
        self.songs = []
        self.library = library

    def add_song_to_playlist(self, title, artist, genre):
        song = next((s for s in self.library.songs if s.title == title and s.artist == artist), None)

        if not song:
            song = Song(title, artist, genre)
            self.library.add_song_to_library(song)
            print(f'New song "{song.title}" added to playlist and library.')

        if not any(s.id == song.id for s in self.songs):
            self.songs.append(song)
            print(f'Song "{song.title}" added to playlist.')
        else:
            print(f'Song "{song.title}" already exists in this playlist.')

    def search_songs_in_playlist(self, search_term, attribute='title'):
        results = []
        if attribute == 'id':
            for song in self.songs:
                if int(search_term) == song.id:
                    results.append(song.show_song_details())
        else:
            results = [song.show_song_details() for song in self.songs if search_term.lower() in getattr(song, attribute).lower()]

        if not results:
            print('No songs found for your search criteria.')
            return []
        
        return results

    def update_song_in_playlist(self, song_id, title=None, artist=None, genre=None):
        song = next((s for s in self.songs if s.id == song_id), None)

        if song:
            song.title = title or song.title
            song.artist = artist or song.artist
            song.genre = genre or song.genre
            print(f'Song with ID {song_id} updated successfully.')
        else:
            print(f'Song with ID {song_id} not found in playlist.')

        return song

    def remove_song_from_playlist(self, song_id):
        song = next((s for s in self.songs if s.id == song_id), None)

        if song:
            self.songs.remove(song)
            print(f'Song with ID {song_id} removed from playlist.')
        else:
            print(f'Song with ID {song_id} not found in playlist.')

    def sort_songs_in_playlist(self, attributes=['title']):
        self.songs.sort(key=lambda song: [getattr(song, attr) for attr in attributes])

    def display_playlist(self):
        songs = []
        print(f'Playlist: {self.name}')
        if not self.songs:
            print('\tPlaylist currently has no songs.')
            songs.append('Playlist currently has no songs.')
        else:
            for song in self.songs:
                song_data = song.show_song_details()
                songs.append(song_data)

        return {'name': self.name, 'songs': songs}

