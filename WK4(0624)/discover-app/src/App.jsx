import './App.css';
import { useState } from 'react';

const App = () => {
  const [artwork, setArtwork] = useState(null)       // current result
  const [banList, setBanList] = useState([])         // array of banned strings
  const [isLoading, setIsLoading] = useState(false)  // fetch in progress
  const [error, setError] = useState(null)           // retry limit hit / network fail

  const fetchArtwork = async (currentBanList, retries = 0) => {
    // select a random page between 1 - 1200
    const pageNum = Math.floor(Math.random() * 1200) + 1;

    // create randomized url with generated page number
    const url = `https://api.artic.edu/api/v1/artworks?page=${pageNum}&limit=1&fields=id,title,artist_display,medium_display,image_id,date_display,thumbnail`

    // fetch url
    const response = await fetch(url);

    // data obtained from url
    const data = await response.json();
    const item = data.data[0];
    const imageBaseUrl = data.config.iiif_url;

    // .some loops through all values in currentBanList
    // checks if each banned matches with artist or medium
    const isBannedResult = currentBanList.some(banned =>
      item.artist_display?.includes(banned) || item.medium_display?.includes(banned));

    // if the artwork has no image_id or it is a banned item
    if (!item.image_id || isBannedResult) {
      if (retries >= 10) { setError("Ban list too restrictive."); return; }

      // retries is < 10, retry while incrementing retries
      return fetchArtwork(currentBanList, retries + 1);
    }

    // save as a single item
    setArtwork({ ...item, imageBaseUrl: '/iiif' });
  }

  const handleDiscover = async () => {
    setIsLoading(true);
    setError(null);
    await fetchArtwork(banList);
    setIsLoading(false);
  }

  // value is selected by user
  const handleBanToggle = (value) => {
    // use previous list (or most updated one prior to change)
    setBanList(prev =>
      // if list included value, then remove it : otherwise add it to previous list
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };
  
  const isBanned = (value) => banList.includes(value);

  return (
    <div className="App">
      <h1>Discover Art</h1>
      <p>Want to learn more about fine art? Take a look at some pieces and their backgrounds!</p>

      <button onClick={handleDiscover} disabled={isLoading}>
      { isLoading ? "Finding something..." : "Discover"}
      </button>

      {error && <p className="error">{error}</p>}

      {artwork && (
        <div className="card">
          <img
            src={`${artwork.imageBaseUrl}/${artwork.image_id}/full/843,/0/default.jpg`}
            alt={artwork.title}
            style={{ width: '100%', maxWidth: '600px' }}
          />
          <div className="attributes">
            <span className="label">Title</span>
            <span className="value">{artwork.title}</span>

            <span className="label">Artist</span>
            <span
              className={`value clickable ${isBanned(artwork.artist_display) ? "banned" : ""}`}
              onClick={() => handleBanToggle(artwork.artist_display)}
            >
              {artwork.artist_display}
            </span>

            <span className="label">Medium</span>
              <span
                className={`value clickable ${isBanned(artwork.medium_display) ? "banned" : ""}`}
                onClick={() => handleBanToggle(artwork.medium_display)}
              >
                {artwork.medium_display}
              </span>

              <span className="label">Date</span>
              <span
                className={`value clickable ${isBanned(artwork.date_display) ? "banned" : ""}`}
                onClick={() => handleBanToggle(artwork.date_display)}
              >
                {artwork.date_display}
              </span>
          </div>
        </div>
      )}

      <aside className="ban-list">
        <h2>Banned</h2>
        {banList.map(item => (
          <button
            key={item}
            className="ban-tag"
            onClick={() => handleBanToggle(item)}
          >
            {item} ✕
          </button>
        ))}
      </aside>
    </div>
  );
};

export default App;