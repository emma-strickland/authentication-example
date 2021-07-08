# emmastrickland.me

This is my personal website that that has my basic contact information, as well as what I'm currently listening to on Spotify. The frontend is built with React and is hosted on Github pages, and the server is built with Express and is hosted on Heroku; both are deployed automatically on pushes to the `main` branch. The server accesses the [Last.fm API](https://www.last.fm/api) to display my most recently played track & artist. 

## Usage

1. Clone the repository:
  ```
  git clone https://github.com/emma-strickland/emmastrickland.me
  cd emmastrickland.me
  ```

`./packages/api` = Server \
`./packages/app` = Frontend

### Api

1. Create an `.env` file in `./packages/api` to store your LastFM API key:
   ```
   LASTFM_API_KEY=abc123
   ```
2. Install dependencies and start the server:
    ```
    yarn backend:install
    yarn backend:start
    ```
3. For hot reload, install [Nodemon](https://www.npmjs.com/package/nodemon) globally and start using the following:
   ```
   npm install -g nodemon
   yarn backend:start-nodemon
   ```

### App

1. Install depdencies and start the app: 
    ```
    yarn frontend:install
    yarn frontend:start
    ```
2. Basic configuration changes (e.g., pointing at a different server) can be made in `./packages/app/src/config.js`.
