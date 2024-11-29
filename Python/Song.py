
class Song:
    id_counter = 1

    def __init__(self, title, artist, genre):
        self.id = Song.id_counter
        Song.id_counter += 1
        self.title = title
        self.artist = artist
        self.genre = genre

    def show_song_details(self):
        print(f"\t{self.id}. {self.title}, By: {self.artist} (Genre: {self.genre})")
