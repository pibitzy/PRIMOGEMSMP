/*
Mikel telah menambahkan banyak komen yang dapat membantu
Jika ada pertanyaan lebih lanjut, tanya mikel
*/
// Import fitur-fitur penting
import { useEffect, useState } from "react";
import "./index.js";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import spotifyAPI from "./Spotify.png";
import primogems from "./Primogems.png";
import {
  Card,
  Button,
  Row,
  Col,
  Container,
  Modal,
  Navbar,
  Nav,
  Image
} from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Client ID dan Client Secret
const clientID = "eeef045c75e5488f8543305bc2be05f4";
const clientSecret = "29882680ac4c4d0fb9ae342280a7101c";

/*
PERHATIAN!!!
Beberapa dependencies yang harus diinstall adalah sebagai berikut:
1. Bootstrap
2. font-awesome
3. loader-utils
4. react
5. react-bootstrap
6. react-dom
7. react-scripts
8. react-slick
9. slick-carousel

Program dapat mengalami gangguan jika tidak menginstall dependencies tersebut
*/

export default function App() {
  // Hooks
  const [searchingInput, setSearchingInput] = useState(""); // Fitur Search
  const [token, setToken] = useState(""); // Token untuk mengakses konten Spotify
  const [albums, setAlbums] = useState([]); // Albums hasil search
  const [tracks, setTracks] = useState([]); // Tracks hasil search
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Fitur pop up ketika album di klik
  const [selectedTrack, setSelectedTrack] = useState(null); // Fitur pop up ketika track di klik
  const [favoriteAlbums, setFavoriteAlbums] = useState([]); // Fitur Favorite
  const [favoriteTracks, setFavoriteTracks] = useState([]); // Fitur Favorite
  const [showFavorites, setShowFavorites] = useState(false); // Fitur Favorite

  // Interaksi dengan API
  useEffect(() => {
    // Meminta access token dari Spotify
    var parameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientID +
        "&client_secret=" +
        clientSecret
    };

    fetch("https://accounts.spotify.com/api/token", parameters)
      .then((result) => result.json())
      .then((data) => setToken(data.access_token));
  }, []);

  // Di beranda, masukkan albums populer
  useEffect(() => {
    const limit = 50; // Jumlah maksimal konten yang dapat diambil

    if (token) {
      var searchP = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      };

      fetch(
        "https://api.spotify.com/v1/browse/new-releases?limit=" + limit,
        searchP
      )
        .then((response) => response.json())
        .then((data) => {
          setAlbums(data.albums.items);
        })
        .catch((error) => console.log(error));
    }
  }, [token]);

  // Di beranda, masukkan tracks populer
  useEffect(() => {
    const limit = 50; // Jumlah maksimal konten yang dapat diambil

    if (token) {
      var searchP = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      };

      fetch(
        "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks?limit=" +
          limit,
        searchP
      )
        .then((response) => response.json())
        .then((data) => {
          setTracks(data.items.map((item) => item.track));
        })
        .catch((error) => console.log(error));
    }
  }, [token]);

  //  Fitur search
  async function search() {
    /*
    Penjelasan
    Fitur search akan menerima input dari user berupa nama artist, kemudian
    program akan mencari album dan track yang relevan berdasarkan ID dari
    artist tersebut
    */

    // Meminta ID dari artist
    var searchP = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    };
    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchingInput + "&type=artist",
      searchP
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    // Mendapatkan albums berdasarkan artist ID
    var albumsResult = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&limit=50",
      searchP
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });

    // Mendapatkan tracks berdasarkan artist ID
    var tracksResult = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/top-tracks" +
        "?include_groups=tracks&market=US&limit=50",
      searchP
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTracks(data.tracks);
      });
  }

  // Modal digunakan untuk pop up window album dan track
  const openAlbumModal = (album) => {
    if (!favoriteAlbums.includes(album)) {
      setSelectedAlbum(album);
    }
  };

  const openTrackModal = (track) => {
    if (!favoriteTracks.includes(track)) {
      setSelectedTrack(track);
    }
  };

  // Menutup modal dari album dan track
  const closeModal = () => {
    setSelectedAlbum(null);
    setSelectedTrack(null);
  };

  // Fitur add to favorite - Dapat menambahkan lagu atau album ke list favorit
  const addToFavorites = (item) => {
    if (
      item.type === "album" &&
      favoriteAlbums.length < 10 &&
      !favoriteAlbums.some((album) => album.id === item.item.id)
    ) {
      setFavoriteAlbums([...favoriteAlbums, item.item]);
    } else if (
      item.type === "track" &&
      favoriteTracks.length < 10 &&
      !favoriteTracks.includes(item.item)
    ) {
      setFavoriteTracks([...favoriteTracks, item.item]);
    }
  };

  // Fitur remove from favorite - Dapat membuang lagu atau album dari list favorit
  const removeFromFavorites = (item) => {
    if (item.type === "album") {
      setFavoriteAlbums(
        favoriteAlbums.filter((album) => album.id !== item.item.id)
      );
    } else if (item.type === "track") {
      setFavoriteTracks(favoriteTracks.filter((track) => track !== item.item));
    }
  };

  // Pop up window untuk fitur favorite
  const FavoritesModal = () => {
    return (
      <Modal show={showFavorites} onHide={() => setShowFavorites(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Favorites</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {favoriteAlbums.map((album, index) => (
            <Nav.Link key={index}>
              {album.name} (Album)
              <Button
                variant="link"
                onClick={() =>
                  removeFromFavorites({ type: "album", item: album })
                }
              >
                Remove
              </Button>
            </Nav.Link>
          ))}
          {favoriteTracks.map((track, index) => (
            <Nav.Link key={index}>
              {track.name} (Track)
              <Button
                variant="link"
                onClick={() =>
                  removeFromFavorites({ type: "track", item: track })
                }
              >
                Remove
              </Button>
            </Nav.Link>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFavorites(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Slider yang digunakan ketika konten yang ada lebih panjang daripada panjang website
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5
  };

  // Kembalikan hasil (untuk kemudahan membaca, mikel sudah membagi ke beberapa bagian)
  return (
    <div className="App">
      {/* Navigation Bar Section */}
      <Navbar
        className="navbar navbar-dark bg-dark justify-content-end"
        expand="lg"
      >
        <Navbar.Brand>
          <Image className="logo" src={primogems} height="30" alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link onClick={() => setShowFavorites(!showFavorites)}>
              Favorites ({favoriteAlbums.length + favoriteTracks.length})
            </Nav.Link>
            {showFavorites && (
              <FavoritesModal
                favoriteAlbums={favoriteAlbums}
                favoriteTracks={favoriteTracks}
                removeFromFavorites={removeFromFavorites}
              />
            )}
            {favoriteAlbums.map((album, index) => (
              <Nav.Link key={index}>
                {album.name} (Album)
                <Button
                  variant="link"
                  onClick={() =>
                    removeFromFavorites({ type: "album", item: album })
                  }
                >
                  Remove
                </Button>
              </Nav.Link>
            ))}
            {favoriteTracks.map((track, index) => (
              <Nav.Link key={index}>
                {track.name} (Track)
                <Button
                  variant="link"
                  onClick={() =>
                    removeFromFavorites({ type: "track", item: track })
                  }
                >
                  Remove
                </Button>
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Search Section */}
      <Container>
        <div class="search">
          <div class="icon"></div>
          <input
            placeholder="Search by Artist"
            type="input"
            onChange={(event) => {
              setSearchingInput(event.target.value);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter" && searchingInput !== "") {
                // Jika sudah tekan enter, lakukan searching sesuai input
                search();
              }
            }}
          />

          <Button
            className="btn btn-dark"
            onClick={() => {
              if (searchingInput !== "") {
                search();
              }
            }}
          >
            Search
          </Button>
        </div>
      </Container>

      {/* Albums Section */}
      <Container>
        <Row className="mx-2">
          <Col>
            <h1 class="mt-4">Albums</h1>
            <div className="slider-container">
              {albums.length > 0 ? (
                albums.map((album, i) => (
                  <div
                    key={i}
                    className="slider-card"
                    onClick={() => openAlbumModal(album)}
                  >
                    <Card>
                      <Card.Img src={album.images[0].url} />
                      <Card.Body>
                        <Card.Title>{album.name}</Card.Title>
                      </Card.Body>
                    </Card>
                  </div>
                ))
              ) : (
                <p>No albums found.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Tracks Section */}
      <Container>
        <Row className="mx-2">
          <Col>
            <h1 class="mt-4">Tracks</h1>
            <div className="slider-container">
              {tracks.length > 0 ? (
                tracks.map((track, i) => (
                  <div
                    key={i}
                    className="slider-card"
                    onClick={() => openTrackModal(track)}
                  >
                    <Card>
                      <Card.Img src={track.album.images[0].url} />
                      <Card.Body>
                        <Card.Title>{track.name}</Card.Title>
                      </Card.Body>
                    </Card>
                  </div>
                ))
              ) : (
                <p>No tracks found.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <div
        class="page-footer row text-white border bg-dark p-4 mt-5 justify-content-end"
        expand="lg"
      >
        <p class="col-12 col-md text-md-start ms-md-2 text-center">
          Ⓒ Primogems Project 2023. All Rights Reserved.
        </p>
        <div class="col-12 col-md float-end">
          <p>Made by using</p>

          <Image
            class="float-md-end"
            src={spotifyAPI}
            height="30"
            alt="Spotify"
          />
        </div>
      </div>

      {/* Pop up window Albums ketika ditekan user */}
      <Modal show={selectedAlbum !== null} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Album Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAlbum && (
            <div>
              <h2>Album Name: {selectedAlbum.name}</h2>
              <h2>Release Date: {selectedAlbum.release_date}</h2>
              <h2>Tracks Total: {selectedAlbum.total_tracks}</h2>
              <h2>Artist: {selectedAlbum.artists[0].name}</h2>
              {/* Kalau mau, bisa tambahkan lebih banyak informasi mengenai albums di sini */}
              {/* Untuk format data, bisa dilihat di spotify api web documentation */}
              <Button
                variant="primary"
                onClick={() =>
                  addToFavorites({ type: "album", item: selectedAlbum })
                }
                disabled={
                  favoriteAlbums.includes(selectedAlbum) ||
                  favoriteAlbums.length >= 10
                }
              >
                Add to Favorite
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pop up window tracks ketika ditekan oleh user */}
      <Modal show={selectedTrack !== null} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Track Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTrack && (
            <div>
              <h2>Track Name: {selectedTrack.name}</h2>
              <h2>Track Album: {selectedTrack.album.name}</h2>
              <h2>Release Date: {selectedTrack.album.release_date}</h2>
              <h2>Artist: {selectedTrack.artists[0].name}</h2>
              {/* Kalau mau, bisa tambahkan lebih banyak informasi mengenai tracks di sini */}
              {/* Untuk format data, bisa dilihat di spotify api web documentation */}
              <Button
                variant="primary"
                onClick={() =>
                  addToFavorites({ type: "track", item: selectedTrack })
                }
                disabled={
                  favoriteTracks.includes(selectedTrack) ||
                  favoriteTracks.length >= 10
                }
              >
                Add to Favorite
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
