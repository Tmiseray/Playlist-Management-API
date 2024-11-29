from Playlist import Playlist
from Song import Song

class Library:
    def __init__(self):
        self.playlists = []
        self.songs = []

    def add_song_to_library(self, song):
        if not any(s.id == song.id for s in self.songs):
            self.songs.append(song)
        else:
            print(f'Song with ID {song.id} already exists in the Library.')

    def add_playlist_to_library(self, playlist_name):
        if any(p.name == playlist_name for p in self.playlists):
            print(f'Playlist "{playlist_name}" already exists.')
            return

        new_playlist = Playlist(playlist_name, self)
        self.playlists.append(new_playlist)
        print(f'Playlist "{new_playlist.name}" added successfully.')

    def search_songs_in_library(self, search_term, attribute='title'):
        results = [song for song in self.songs if search_term.lower() in getattr(song, attribute).lower()]
        
        if not results:
            print('No songs found for your search criteria.')
            return []
        return results

    def get_playlist_from_library(self, playlist_name):
        playlist = next((p for p in self.playlists if p.name == playlist_name), None)
        return playlist

    def update_song_in_library(self, song_id, title=None, artist=None, genre=None):
        song = next((s for s in self.songs if s.id == song_id), None)
        
        if song:
            song.title = title or song.title
            song.artist = artist or song.artist
            song.genre = genre or song.genre
            return song
        return None

    def update_playlist_in_library(self, old_name, new_name):
        old_playlist = next((p for p in self.playlists if p.name == old_name), None)
        
        if not old_playlist:
            print(f'Playlist "{old_name}" not found.')
            return

        if any(p.name == new_name for p in self.playlists):
            print(f'Playlist with the name "{new_name}" already exists.')
            return

        new_playlist = Playlist(new_name, self)
        
        for song in old_playlist.songs:
            new_playlist.add_song_to_playlist(song.title, song.artist, song.genre)

        self.remove_playlist_from_library(old_name)
        self.playlists.append(new_playlist)
        print(f'Playlist name changed from "{old_name}" to "{new_playlist.name}".')

        return new_playlist

    def remove_song_from_library(self, song):
        song_to_remove = next((s for s in self.songs if s.id == song.id), None)
        if song_to_remove:
            self.songs.remove(song_to_remove)
            print(f'Song "{song.title}" successfully removed from Library.')
        else:
            print('Song not found.')

    def remove_playlist_from_library(self, playlist_name):
        playlist_to_remove = next((p for p in self.playlists if p.name == playlist_name), None)
        
        if playlist_to_remove:
            self.playlists.remove(playlist_to_remove)
            print(f'Playlist "{playlist_name}" removed successfully.')
        else:
            print('Playlist not found.')

    def sort_songs_in_library(self, attributes=['title']):
        self.songs.sort(key=lambda song: [getattr(song, attr) for attr in attributes])

    def sort_playlists_in_library(self):
        self.playlists.sort(key=lambda playlist: playlist.name)

    def sort_library(self, song_sort_attributes=['title']):
        print('Before Sorting:', self.songs)

        self.sort_playlists_in_library()

        for playlist in self.playlists:
            playlist.sort_songs_in_playlist(song_sort_attributes)

        self.sort_songs_in_library(song_sort_attributes)

        print('After Sorting:', self.songs)

    def display_library(self):
        print("\nSongs in the Library:")
        if not self.songs:
            print("Currently no songs in Library.")
        else:
            for song in self.songs:
                print(f'{song.id}. Song: {song.title} by {song.artist} ({song.genre})')

        print("\nPlaylists in Library:")
        if not self.playlists:
            print("Currently no playlists in Library.")
        else:
            for playlist in self.playlists:
                playlist.display_playlist()

        return {'songs': self.songs, 'playlists': [{'name': p.name, 'songs': p.songs} for p in self.playlists]}

