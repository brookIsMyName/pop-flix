import { tmdbFetch } from "../tmdb";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "./LoadingPage";
import ErrorPage from "./Error";

const WatchPage = ({ moviesList }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [movieError, setMovieError] = useState(null);

  // Try to get from props first
  useEffect(() => {
    setIframeLoaded(false);
    setMovie(null);
    setMovieError(null);
    if (moviesList && moviesList.length > 0) {
      const localMovie = moviesList.find((movie) => movie.id === parseInt(id));
      if (localMovie) {
        setMovie(localMovie);
        return;
      }
    }

    // If not found in props, fetch from API
    const fetchMovie = async () => {
      try {

        const response = await tmdbFetch(`https://api.themoviedb.org/3/movie/${id}`);
        if (!response.ok) {
          const error = new Error("Movie not found");
          error.status = response.status;
          throw error;
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        setMovieError(error);
      }
    };

    fetchMovie();
  }, [id, moviesList]);

  if (movieError) {
    const code = movieError.status || (movieError.name === "TypeError" ? 503 : 500);
    return <ErrorPage code={code} title={code === 404 ? "Movie not found" : "Couldn't load this movie"} message={code === 404 ? "This movie may no longer be available." : "We couldn't reach the movie details."} steps={["Check your internet connection.", "Go back and try again."]} />;
  }
  if (!movie) {
    return (
      <div className="text-black text-center justify-center text-3xl">
        Loading movie...
      </div>
    );
  }

  const { title } = movie;
  const embedURL = `https://vidsrc.sh/embed/movie/${id}`;

  return (
    <main className="watch-page">
      <h1 className="watch-page-title">{title}</h1>
      <div className="watch-player-wrap">
        {!iframeLoaded && <div className="watch-player-loading"><Loading /></div>}
        <iframe
          src={embedURL}
          title={`${title} player`}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          scrolling="no"
          allowFullScreen
          className="watch-player"
          onLoad={() => setIframeLoaded(true)}
        ></iframe>
      </div>
      <Link className="watch-home-button text-decoration-none" to="/">Home</Link>
    </main>
  );
};

export default WatchPage;
