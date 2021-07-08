import React, { useEffect, useState } from 'react';
import './App.css';
import config from './config';

function App() {
  const [response, setResponse] = useState('');

  const openSpotifyProfile = () => {
    window.open(config.SPOTIFY_PROFILE_URL, "_blank");
  }

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/recentlyPlayed`)
      .then(res => res.json())
      .then(result => {
        setResponse(result);
      }).catch(error => {
        console.log('error: ', error);
      });
  }, []);

  return (
    <div className="App">
      {response && (
        <div className="container">
          <div className="title">{config.NAME}</div>
          <div className="subtext">
            Software Engineer based in Brooklyn, NY
            <hr />
            <div className="link">
              <a href={`mailto:${config.EMAIL_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                Email
              </a>
            </div>
            <div className="link">
              <a href={config.LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
            <div className="link">
              <a href={config.GITHUB_URL} target="_blank" rel="noopener noreferrer">
                Github
              </a>
            </div>
            <hr />
            <div className="current">
              Currently listening to:
            </div>
            <div className="music-text">
              <img src={response.image} alt="album-art" className="album-art" onClick={openSpotifyProfile} />
              <div className="music-subtitle">"{response.track}" – {response.artist}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
