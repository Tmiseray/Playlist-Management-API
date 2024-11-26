class Song {
    constructor(title, artist, genre) {
        this.id = Song.idCounter++;
        this.title = title;
        this.artist = artist;
        this.genre = genre;
    }

    showSongDetails() {
        console.log(`${this.id}. ${this.title}, By: ${this.artist} \nGenre: ${this.genre}`);
        return this.id, this.title, this.artist, this.genre;
    }
}
Song.idCounter = 1;

export default Song;