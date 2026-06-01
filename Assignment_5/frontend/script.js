const API = "http://localhost:5000";

window.onload = function (){
    showPage("home");

    loadArtists();
    loadAlbums();
    loadSongs();

    document.getElementById("artist-form").onsubmit = addArtist;
    document.getElementById("album-form").onsubmit = addAlbum;
    document.getElementById("song-form").onsubmit = addSong;
};

function showPage(pageID) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(function (page) {
        page.style.display = "none";
    });

    document.getElementById(pageID).style.display = "block";
}    

async function loadArtists() {
    const response = await fetch(`${API}/artists`);
    const artists = await response.json();

    let rows = "";

    artists.forEach(function (artist){
        rows += `
            <tr>
                <td>${artist.id}</td>
                <td>${artist.name}</td>
                <td>${artist.genre}</td>
                <td>${artist.monthly_listeners}</td>

                <td>
                    <button onclick='editArtist(${artist.id}, ${JSON.stringify(artist.name)}, ${JSON.stringify(artist.genre)}, ${artist.monthly_listeners})'>Edit</button>
                    <button onclick="deleteArtist(${artist.id})">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("artists-table").innerHTML = rows;
}

function editArtist(id, name, genre, monthly_listeners) {
    document.getElementById("artist-id").value = id;
    document.getElementById("artist-name").value = name;
    document.getElementById("artist-genre").value = genre;
    document.getElementById("artist-listeners").value = monthly_listeners;
}

async function addArtist(event){
    event.preventDefault();

    const id = document.getElementById("artist-id").value;

    const artist = {
        name: document.getElementById("artist-name").value,
        genre: document.getElementById("artist-genre").value,
        monthly_listeners: parseInt(document.getElementById("artist-listeners").value)
    };

    const url = id ? API + "/artists/" + id : API + "/artists";
    const method = id ? "PUT" : "POST";

    await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artist)
    });

    document.getElementById("artist-form").reset();
    document.getElementById("artist-id").value = "";

    loadArtists();
    loadAlbums();
    loadSongs();
}

async function loadAlbums(){
    const response = await fetch(API + "/albums");
    const albums = await response.json();

    let rows = "";

    albums.forEach(function (album){
        rows += `
            <tr>
                <td>${album.id}</td>
                <td>${album.name}</td>
                <td>${album.release_year}</td>
                <td>${album.listens}</td>
                <td>${album.artist_id}</td>
                <td>${album.artist_name}</td>

                <td>
                    <button onclick='editAlbum(${album.id}, ${JSON.stringify(album.name)}, ${album.release_year}, ${album.listens}, ${album.artist_id})'>Edit</button>
                    <button onclick="deleteAlbum(${album.id})">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("albums-table").innerHTML = rows;
}

function editAlbum(id, name, release_year, listens, artist_id) {
    document.getElementById("album-id").value = id;
    document.getElementById("album-name").value = name;
    document.getElementById("album-year").value = release_year;
    document.getElementById("album-listens").value = listens;
    document.getElementById("album-artist-id").value = artist_id;
}

async function deleteArtist(id){
    await fetch(API + "/artists/" + id, {
        method: "DELETE"
    });

    loadArtists();
    loadAlbums();
    loadSongs();
}

async function addAlbum(event){
    event.preventDefault();

    const id = document.getElementById("album-id").value;

    const album = {
        name: document.getElementById("album-name").value,
        release_year: parseInt(document.getElementById("album-year").value),
        listens: parseInt(document.getElementById("album-listens").value),
        artist_id: parseInt(document.getElementById("album-artist-id").value)
    };

    const url = id ? API + "/albums/" + id : API + "/albums";
    const method = id ? "PUT" : "POST";

    await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(album)
    });

    document.getElementById("album-form").reset();
    document.getElementById("album-id").value = "";
    loadAlbums();
    loadSongs();
}

async function deleteAlbum(id){
    await fetch(API + "/albums/" + id, {
        method: "DELETE"
    });

    loadAlbums();
    loadSongs();
}

async function loadSongs() {
    const response = await fetch(API + "/songs");
    const songs = await response.json();

    let rows = "";

    songs.forEach(function (song) {
        rows += `
            <tr>
                <td>${song.id}</td>
                <td>${song.name}</td>
                <td>${song.release_year}</td>
                <td>${song.album_id}</td>
                <td>${song.album_name}</td>
                <td>
                    <button onclick="fillSong(${song.id}, '${song.name}', ${song.release_year}, ${song.album_id})">Edit</button>
                    <button onclick="deleteSong(${song.id})">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("songs-table").innerHTML = rows;
}
function fillSong(id, name, release_year, album_id) {
    document.getElementById("song-id").value = id;
    document.getElementById("song-name").value = name;
    document.getElementById("song-year").value = release_year;
    document.getElementById("song-album-id").value = album_id;
}

async function addSong(event) {
    event.preventDefault();

    const id = document.getElementById("song-id").value;

    const song = {
        name: document.getElementById("song-name").value,
        release_year: parseInt(document.getElementById("song-year").value),
        album_id: parseInt(document.getElementById("song-album-id").value)
    };

    const url = id ? API + "/songs/" + id : API + "/songs";
    const method = id ? "PUT" : "POST";

    await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(song)
    });

    document.getElementById("song-form").reset();
    document.getElementById("song-id").value = "";
    loadSongs();
}

async function deleteSong(id) {
    await fetch(API + "/songs/" + id, {
        method: "DELETE"
    });

    loadSongs();
}