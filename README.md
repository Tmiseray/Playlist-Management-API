# Playlist-Management-API
Coding Temple - Module 12, Mini-Project: Playlist Management API


## Overview
This project is a Playlist Management API that allows users to manage songs and playlists. 
Users can create songs, create playlists, and manage the contents of playlists by adding or removing songs. 

The system is implemented using two different frameworks:
- **Python/Flask:** A backend API built using Python and the Flask framework.
- **JavaScript/Express:** A backend API built using JavaScript and the Express framework.

The core idea is to provide a digital library for users to create playlists, add songs to them, and perform various operations like sorting, updating, and searching for songs.


## Project Structure
This repository contains two main directories:

- **Python/:**
    * The Python implementation using Flask for managing songs and playlists.
- **JavaScript/:**
    * The JavaScript implementation using Express for managing songs and playlists.

Each directory contains its respective code, and both implementations offer the same functionality.


## Key Features
- **Python/Flask API**
    * Song Management:
        - Add, update, delete, and search for songs in the library.
    * Playlist Management:
        * Create, update, delete, and get playlists.
        * Add or remove songs from playlists.
        * Sort songs within playlists by title, artist, or genre.

- **JavaScript/Express API**
    * Song Management:
        - Add, update, delete, and search for songs in the library.
    * Playlist Management:
        - Create, update, delete, and get playlists.
        - Add or remove songs from playlists.
        - Sort songs within playlists by title, artist, or genre.


## API Endpoints
**General Endpoints**
- **GET** /: Welcome message to the API.

**Library Endpoints**
- ***Song Endpoints***
    * **POST** /library/add-song: *Add a song to the library.*
    * **PUT** /library/update-song/:songId: *Update song details (title, artist, genre).*
    * **DELETE** /library/songs/:attribute/:searchTerm: *Delete a song by attribute (e.g., title, artist, genre).*
    * **GET** /library/songs/search/:attribute/:searchTerm: *Search for a song by attribute (e.g., title, artist, genre).*
    * **GET** /library/sort/:attribute: *Sort all songs in the library.*
- ***Playlist Endpoints***
    * **POST** /library/create-playlist: *Create a new playlist.*
    * **PUT** /library/update-playlist/:playlistName: *Update the name of a playlist.*
    * **DELETE** /library/playlists/:playlistName: *Delete a playlist.*
    * **GET** /library/playlists/:playlistName: *Get a playlist by name.*

**Playlist Endpoints**
- **POST** /:playlistName/add-song: *Add a song to a playlist.*
- **PUT** /:playlistName/update-song/:songId: *Update song details within a playlist.*
- **DELETE** /:playlistName/songs/:songId: *Remove a song from a playlist.*
- **GET** /:playlistName/songs/search/:attribute/:searchTerm: *Search for songs in a playlist.*
- **GET** /:playlistName/songs/sort/:attribute: *Sort songs in a playlist by attributes like name, genre, or artist.*


## Getting Started
**Prerequisites**

Ensure that you have the following tools installed:

- ***For Python/Flask API:***
    * Python 3.x
    * Required Python libraries:
        - Flask
        - Flask-SQLAlchemy
        - Flask-Marshmallow

- ***For JavaScript/Express API:***
    * Node.js
    * npm


## Installation
1. **Clone the Repository**
    * Clone this repository to your local machine:
        ```
        git clone https://github.com/Tmiseray/Playlist-Management-API.git
        cd Playlist-Management-API
        ```

2. **Set Up Python/Flask API**
    * Navigate to the Python/ directory.
        ```
        cd Python
        ```
    * Create and activate a virtual environment:
        ```
        python -m venv venv
        source venv/bin/activate
        ```
        ***On Windows, use***
        `venv\Scripts\activate`
    * Install the required libraries:
        ```
        pip install flask flask_sqlalchemy flask_marshmallow
        ```
    * Run the Flask application:
        ```
        python app.py
        ```
        ***The Flask server should now be running locally on http://127.0.0.1:3000.***

3. **Set Up JavaScript/Express API**
    * Navigate to the JavaScript/ directory.
        ```
        cd JavaScript
        ```
    * Install the required Node.js dependencies:
        ```
        npm install
        ```
    * Run the Express application:
        ```
        npm start
        ```
        ***The Express server should now be running locally on http://127.0.0.1:3000.***


## Contributing
Contributions are welcome! If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.