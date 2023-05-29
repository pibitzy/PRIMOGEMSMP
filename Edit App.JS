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
