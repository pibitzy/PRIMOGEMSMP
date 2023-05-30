// Import fitur-fitur penting
import { useEffect, useState } from "react";
import "./index.js";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import spotifyAPI from "./images/Logo API.png";
import primogems from "./images/LogoPrimogemsMP.png";
import brand from "./images/Brand.png";
import profile1 from "./images/pibi.jpg";
import profile2 from "./images/mikel.jpg";
import profile3 from "./images/citra.jpg";
import profile4 from "./images/palen.jpg";
import insta from "./images/instagram.png";
import cari from "./images/search.png";
import taptap from "./images/LogoPrimogems.png";
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
  const [showAboutUs, setShowAboutUs] = useState(false); //Fitur About Us

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
    const limit = 30; // Jumlah maksimal konten yang dapat diambil

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
    const limit = 30; // Jumlah maksimal konten yang dapat diambil

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
      <Modal show={showFavorites} onHide={() => setShowFavorites(false)} className="modal-xl">
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

  const handleHomeClick = () => {
    window.location.reload();
  };

  // Kembalikan hasil
  return (
    <div className="App">
      {/* Navigation Bar Section */}
      <Navbar className="navbar navbar-dark bg-dark justify-content-end" expand="lg">
        <Navbar.Brand>
          <Image className="logo" src={primogems} height="50" class="d-inline-block align-middle"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-5 align-middle">
            <Nav.Link onClick={handleHomeClick}><h5>Home</h5></Nav.Link>
            <Nav.Link onClick={() => setShowAboutUs(true)}><h5>About Us</h5></Nav.Link>
            <Nav.Link onClick={() => setShowFavorites(!showFavorites)}><h7>Favorites </h7>({favoriteAlbums.length + favoriteTracks.length})</Nav.Link>
            {showFavorites && (
              <FavoritesModal
                favoriteAlbums={favoriteAlbums}
                favoriteTracks={favoriteTracks}
                removeFromFavorites={removeFromFavorites}
              />
            )}
            {favoriteAlbums.map((album, index) => (
              <Nav.Link key={index}>
                <Button
                  variant="link"
                  onClick={() =>
                    removeFromFavorites({ type: "album", item: album })
                  }
                >
                </Button>
              </Nav.Link>
            ))}
            {favoriteTracks.map((track, index) => (
              <Nav.Link key={index}>
                <Button
                  variant="link"
                  onClick={() =>
                    removeFromFavorites({ type: "track", item: track })
                  }
                >
                </Button>
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Image className="brand" src={brand} height="85" alt="PrimogemsMP" />

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

          <button
            className="search-btn"
            onClick={() => {
              if (searchingInput !== "") {
                search();
              }
            }}
          >
            <img src={cari} alt="Search" />
          </button>
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
        class="page-footer row text-white bg-dark p-2 mt-4 justify-content-end"
        expand="lg"
      >
        <p class="col-12 col-md text-md-start d-flex align-items-center mb-0 me-2">
          Ⓒ Primogems Project 2023. All Rights Reserved.
        </p>
        <div class="col-12 col-md-auto text-md-end d-flex align-items-center">
          <p class="mb-0 me-2">Made by using</p>
          <img src={spotifyAPI} height="25" alt="Spotify" class="d-inline-block align-middle" />
      </div>
      </div>

      <Modal show={showAboutUs} onHide={() => setShowAboutUs(false)} className="modal-xl">
      <Modal.Header closeButton>
          <Modal.Title>About Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="profile-container">
            <div className="profile">
              <img src={profile1}alt="Vincent Bryan" />
              <div className="profile-info">
                <h3>Vincent Bryan</h3>
                <p>Bertugas sebagai coders, design, dan hosting web.</p>
              </div>
              <button className="profile-button" onClick={() => window.location.href = "https://www.instagram.com/iuxtzy.vb/"}>
                <img src={insta} alt="Instagram" />
              </button>
            </div>
            <div className="profile">
              <img src={profile2} alt="Michael" />
              <div className="profile-info">
                <h3>Vincent Bryan</h3>
                <p>Bertugas sebagai coders, design, dan hosting web.</p>
              </div>
              <button className="profile-button" onClick={() => window.location.href = "https://www.instagram.com/hartoyo_michael/"}>
                <img src={insta} alt="Instagram" />
              </button>
            </div>
            <div className="profile">
              <img src={profile3} alt="Citra Nandariani I." />
              <div className="profile-info">
                <h3>Vincent Bryan</h3>
                <p>Bertugas sebagai coders, design, dan hosting web.</p>
              </div>
              <button className="profile-button" onClick={() => window.location.href = "https://www.instagram.com/cicit_kyo/"}>
                <img src={insta} alt="Instagram" />
              </button>
            </div>
            <div className="profile">
              <img src={profile4} alt="Valent Joseph S." />
              <div className="profile-info">
                <h3>Vincent Bryan</h3>
                <p>Bertugas sebagai coders, design, dan hosting web.</p>
              </div>
              <button className="profile-button" onClick={() => window.location.href = "https://www.instagram.com/valentjoseph.11/"}>
                <img src={insta} alt="Instagram" />
              </button>
            </div>
            <div className="product">
              <h4>Our Other Products</h4>
                <button className="products" onClick={() => (window.location.href = "https://primogems-taptap.netlify.app/")}>
                  <img src={taptap} alt="Taptap Master" />
                </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAboutUs(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pop up window Albums ketika ditekan user */}
      <Modal show={selectedAlbum !== null} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Album Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAlbum && (
            <div>
              <Card>
                <Card.Img src={selectedAlbum.images[0].url} />
              </Card>
              <h4><b>Album Name: </b></h4><h5>{selectedAlbum.name}</h5>
              <h4><b>Release Date: </b></h4><h5>{selectedAlbum.release_date}</h5>
              <h4><b>Tracks Total: </b></h4><h5>{selectedAlbum.total_tracks}</h5>
              <h4><b>Artist: </b></h4><h5>{selectedAlbum.artists[0].name}</h5>
              <Button
                className="mt-2"
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
      <Modal show={selectedTrack !== null} onHide={closeModal} >
        <Modal.Header closeButton>
          <Modal.Title>Track Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTrack && (
            <div>
              <Card>
                <Card.Img src={selectedTrack.album.images[0].url} />
              </Card>
              <h4><b>Track Name: </b></h4><h5>{selectedTrack.name}</h5>
              <h4><b>Track Album: </b></h4><h5>{selectedTrack.album.name}</h5>
              <h4><b>Release Date: </b></h4><h5>{selectedTrack.album.release_date}</h5>
              <h4><b>Artist: </b></h4><h5>{selectedTrack.artists[0].name}</h5>
              <Button
                className="mt-2"
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