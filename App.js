import { useEffect, useState } from "react";
import "../public/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { Card, Button, Row, Container } from "react-bootstrap";

const clientID = "eeef045c75e5488f8543305bc2be05f4";
const clientSecret = "29882680ac4c4d0fb9ae342280a7101c";

export default function App() {
  const [searchingInput, setSearchingInput] = useState("");
  const [token, setToken] = useState("");
  const [albums, setAlbums] = useState([]);

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
      .then((data) => setToken(data.access_token));
  }, []);

  //  Searching function
  async function search() {
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
        "?include_groups=album&market=US&limit=50",
      searchP
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });

    console.log(albums);
    // Display
  }

  return (
    <div className="App">
      {/* Search Section */}
      <Container>
        <input
          placeholder="Search for Artist"
          type="input"
          onChange={(event) => {
            setSearchingInput(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key == "Enter") {
              // Jika sudah tekan enter, lakukan searching sesuai input
              search();
            }
          }}
        />

        <Button onClick={search}>Search</Button>
      </Container>
      {/* Album Section */}
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) => {
            return (
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}
