import { useEffect, useState } from "react";
import "../public/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { Card, Button, Row, Col, Container, Modal } from "react-bootstrap";

const clientID = "eeef045c75e5488f8543305bc2be05f4";
const clientSecret = "29882680ac4c4d0fb9ae342280a7101c";

export default function App() {
  const [searchingInput, setSearchingInput] = useState("");
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // API interaction
  useEffect(() => {
    // Access token from Spotify
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
      .then((data) => {
        setToken(data.access_token);
        setInitialDataLoaded(true);
        fetchRecentlyPopular();
      });
  }, []);

  // Fetch recently popular albums and tracks
  const fetchRecentlyPopular = async () => {
    var searchP = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    };

    // Get recently popular albums
    var albumsResult = await fetch(
      "https://api.spotify.com/v1/browse/new-releases?limit=8",
      searchP
    )
      .then((response) => response.json())
      .then((data) => {
        setAlbums(data.albums.items);
      });

    // Get recently popular tracks
    var tracksResult = await fetch(
      "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=8",
      searchP
    )
      .then((response) => response.json())
      .then((data) => {
        setTracks(data.items.map((item) => item.track));
      });
  };

  // Searching function
  async function search() {
    // Reset initial data
    setInitialDataLoaded(false);
    setAlbums([]);
    setTracks([]);

    // Search artist ID
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

    // Get album according to artist ID
    var albumsResult = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&limit=50",
      searchP
    )
      .then((response) => response.json())
      .then((data) => {
        setAlbums(data.items);
      });

    var tracksResult = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/top-tracks" +
        "?include_groups=tracks&market=US&limit=50",
      searchP
    )
      .then((response) => response.json())
      .then((data) => {
        setTracks(data.tracks);
      });

    setInitialDataLoaded(true);
  }

  // Open modal for album details
  const openAlbumModal = (album) => {
    setSelectedAlbum(album);
  };

  // Open modal for track details
  const openTrackModal = (track) => {
    setSelectedTrack(track);
  };

  // Close modal
  const closeModal = () => {
    setSelectedAlbum(null);
    setSelectedTrack(null);
  };

  return (
    <div className="App">
      {/* Search Section */}
      <Container>
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
          onClick={() => {
            if (searchingInput !== "") {
              search();
            }
          }}
        >
          Search
        </Button>
      </Container>

      {/* Albums Section */}
      {initialDataLoaded && (
        <Container>
          <h1>Albums</h1>
          <Row className="mx-2">
            {albums.map((album, i) => {
              return (
                <Col key={i} className="col-sm-2">
                  <Card onClick={() => openAlbumModal(album)}>
                    <Card.Img src={album.images[0].url} />
                    <Card.Body>
                      <Card.Title>{album.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      )}

      {/* Tracks Section */}
      {initialDataLoaded && (
        <Container>
          <h1>Tracks</h1>
          <Row className="mx-2">
            {tracks.map((track, i) => {
              return (
                <Col key={i} className="col-sm-2">
                  <Card onClick={() => openTrackModal(track)}>
                    <Card.Img src={track.album.images[0].url} />
                    <Card.Body>
                      <Card.Title>{track.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      )}

      {/* Album pop up window when selected */}
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
              <h2>Artist : {selectedAlbum.artists[0].name}</h2>
              {/* Display additional album details here */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Track pop up window when selected */}
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
              <h2>Artist : {selectedTrack.artists[0].name}</h2>
              {/* Display additional track details here */}
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
