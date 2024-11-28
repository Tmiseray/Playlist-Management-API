
class Song {
    constructor(title, artist, genre) {
        this.id = Song.idCounter++;
        this.title = title;
        this.artist = artist;
        this.genre = genre;
    }

    showSongDetails() {
        console.log(`\t${this.id}. ${this.title}, By: ${this.artist} (Genre: ${this.genre})`);
    }
}
Song.idCounter = 1;

export default Song;