const config = {
    API_BASE_URL: process.env.NODE_ENV === "development"
        ? "http://localhost:4001"
        : "https://website-emma.herokuapp.com",
    NAME: "Emma Strickland",
    EMAIL_ADDRESS: "emlstrick@gmail.com",
    LINKEDIN_URL: "https://www.linkedin.com/in/emmalstrickland/",
    GITHUB_URL: "https://github.com/emma-strickland",
    SPOTIFY_PROFILE_URL: "https://open.spotify.com/user/1242322676?si=865f2ec92d6a4a14",

}

export default config;