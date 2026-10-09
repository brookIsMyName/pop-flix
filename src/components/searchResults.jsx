import React from "react";
import NavbarMain from "./NavbarDefault";
import UncontrolledExample from "./carousel";
import MovieCard from "./movieCard";
import { tmdbFetch } from "../tmdb";
import { useState, useEffect } from "react";
import TvSeries from "./TvSeries";
import MediaRow from "./MediaRow";



const SearchResults =  ({ searchTerm }) => {
      const [moviesList, setMoviesList] = React.useState([]);
      const [tvSeriesList, setTvSeriesList] = React.useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [errorMessage, setErrorMessage] = useState("");
      const API_BASE_URL = "https://api.themoviedb.org/3/trending/movie/week?language=en-US";
      const TV_SERIES_API_BASE_URL = "https://api.themoviedb.org/3/trending/tv/week?language=en-US";

      async function fetchTvSeries(searchTerm) {
    
      try{
          setIsLoading(true);
          const tvEndpoint = searchTerm ?
           `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(searchTerm)}&sort_by=popularity.desc&language=en-US`
           : TV_SERIES_API_BASE_URL;
    
           const res = await tmdbFetch(tvEndpoint);
           const data = await res.json()
     
        
          if (data.success === false || !data.results) {
            setErrorMessage(data.status_message || "Failed to load movies!");
            setTvSeriesList([])
           
          } else {
            
            setTvSeriesList(data.results);
          }
        
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading (false)
      }

    }

    useEffect(() => {
      fetchTvSeries(searchTerm);
    }, [searchTerm]);


    async function fetchMovies(searchTerm) {
      
        try {
          setIsLoading(true);
          const endpoint = searchTerm
            ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchTerm)}`
            : API_BASE_URL;
          const res = await tmdbFetch(endpoint);
          const data = await res.json();
    
          if (data.success === false || !data.results) {
            setErrorMessage(data.status_message || "Failed to load movies!");
            setMoviesList([]);
          } else {
            setMoviesList(data.results);
            // if(query && data.results.length >0){
            //   await updateSearchCount(query, data.results[0]);
            // }
          }
        } catch (err) {
          setErrorMessage("An error occurred while fetching movies.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
     
      }

      useEffect(() => {
        fetchMovies(searchTerm);
      }, [searchTerm]);

const RenderCarousel = ({ title, items, type }) => (
        <MediaRow title={title}>
          {items.map((item) => (
            <div key={item.id} className="movie-row-card">
              {type === "movie" ? <MovieCard movie={item} /> : <TvSeries show={item} />}
            </div>
          ))}
        </MediaRow>
      );

  return (
<>
    <NavbarMain />
    <div className="search-results bg-black pt-25 min-h-screen">
          
<RenderCarousel title="Movies" items={moviesList} type="movie" />
<RenderCarousel title="Tv Series" items={tvSeriesList} type="tv" />
          
        </div>
  </>
      )}


export default SearchResults;