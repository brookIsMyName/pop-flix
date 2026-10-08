import MediaRow from "./components/MediaRow";
import { tmdbFetch } from "./tmdb";
import { useState, useEffect } from "react";
import UncontrolledExample from "./components/carousel"
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MovieCard from "./components/movieCard";
import NavbarMain from "./components/NavbarDefault";
import Description from "./components/Description";
import About from "./components/aboutUs"
import WatchPage from "./components/WatchPage";
import TvSeries from "./components/TvSeries";
import DescriptionForShows from "./components/DescriptionForShows";
import SeriesWatchPage from "./components/SeriesWatchPage";
import SearchResults from "./components/searchResults";
import {useSearchParams} from "react-router-dom"

function SearchRoute()
{
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("query") ?? "";

  return <SearchResults searchTerm={searchTerm} />;
}
const RenderCarousel = ({ title, items, type }) => (
  <MediaRow title={title}>
    {items.map((item) => (
      <div key={item.id} className="movie-row-card">
        {type === "movie" ? <MovieCard movie={item} /> : <TvSeries show={item} />}
      </div>
    ))}
  </MediaRow>
);

const App = () => {
const [showIntro, setShowIntro] = useState(() => {
  try {
    return window.localStorage.getItem("popflix-intro-seen") !== "true";
  } catch {
    return true;
  }
});
const [introIsExiting, setIntroIsExiting] = useState(false);
const [trending, setTrending] = useState([]);
const [topRated, setTopRated] = useState([]);
const [popularTv, setPopularTv] = useState([]);
const [newReleases, setNewReleases] = useState([]);
const [actionMovies, setActionMovies] = useState([]);
const [comedyMovies, setComedyMovies] = useState([]);
const [dramaMovies, setDramaMovies] = useState([]);
const [horrorMovies, setHorrorMovies] = useState([]);
const [romanceMovies, setRomanceMovies] = useState([]);
const [scifiMovies, setScifiMovies] = useState([]);
const [mysteryMovies, setMysteryMovies] = useState([]);
const [familyMovies, setFamilyMovies] = useState([]);
const [documentaries, setDocumentaries] = useState([]);
const [animeMovies, setAnimeMovies] = useState([]);
const [topRatedTv, setTopRatedTv] = useState([]);
const [trendingTv, setTrendingTv] = useState([]);
const [comedyTv, setComedyTv] = useState([]);
const [dramaTv, setDramaTv] = useState([]);
const [scifiTv, setScifiTv] = useState([]);

const fetchCategory = async (url, setter) => {
  try {
    const res = await tmdbFetch(url);
    const data = await res.json();
    setter(data.results || []);
  } catch (err) {
    console.error(err);
  }
};


useEffect(() => {
  fetchCategory(`https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1`, setTopRatedTv);
fetchCategory(`https://api.themoviedb.org/3/trending/tv/week?language=en-US`, setTrendingTv);
fetchCategory(`https://api.themoviedb.org/3/discover/tv?with_genres=35&language=en-US&page=1`, setComedyTv);
fetchCategory(`https://api.themoviedb.org/3/discover/tv?with_genres=18&language=en-US&page=1`, setDramaTv);
fetchCategory(`https://api.themoviedb.org/3/discover/tv?with_genres=10765&language=en-US&page=1`, setScifiTv);
  fetchCategory(`https://api.themoviedb.org/3/trending/movie/week?language=en-US`, setTrending);
  fetchCategory(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, setTopRated);
  fetchCategory(`https://api.themoviedb.org/3/tv/popular?language=en-US&page=1`, setPopularTv);
  fetchCategory(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`, setNewReleases);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=28&language=en-US&page=1`, setActionMovies);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=35&language=en-US&page=1`, setComedyMovies);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=18&language=en-US&page=1`, setDramaMovies);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=27&language=en-US&page=1`, setHorrorMovies);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=10749&language=en-US&page=1`, setRomanceMovies);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=878&language=en-US&page=1`, setScifiMovies);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=9648&language=en-US&page=1`, setMysteryMovies);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=16&language=en-US&page=1`, setFamilyMovies);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=99&language=en-US&page=1`, setDocumentaries);
  fetchCategory(`https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=ja&language=en-US&page=1`, setAnimeMovies);
}, []);

useEffect(() => {
  if (!showIntro) return undefined;

  try {
    window.localStorage.setItem("popflix-intro-seen", "true");
  } catch {
    // The intro can still play when browser storage is unavailable.
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const exitTimer = window.setTimeout(() => setIntroIsExiting(true), prefersReducedMotion ? 100 : 1550);
  const removeTimer = window.setTimeout(() => setShowIntro(false), prefersReducedMotion ? 250 : 2200);

  return () => {
    window.clearTimeout(exitTimer);
    window.clearTimeout(removeTimer);
  };
}, [showIntro]);

 

  return (
    <>
      {showIntro && (
        <div
          className={`welcome-splash${introIsExiting ? " is-exiting" : ""}`}
          role="status"
          aria-label="PopFlix, created by Biruk"
        >
          <div className="welcome-splash-content">
            <span className="welcome-splash-kicker">AN INDEPENDENT PROJECT</span>
            <h1>Biruk</h1>
            <span className="welcome-splash-credit">CREATOR OF POPFLIX</span>
          </div>
          <span className="welcome-splash-bottom" aria-hidden="true">POPFLIX</span>
        </div>
      )}
      <div inert={showIntro}>
        <Router>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={
          <main>
            <div className="wrapper">
              <header className="pt-[0px]relative z-0">
                <NavbarMain />

 
  <section >
              <UncontrolledExample />
            </section>
              
              </header>

                <div>
                  <section className="section-two pt-4">


<RenderCarousel title="Trending Now" items={trending} type="movie" />
<RenderCarousel title="Top Rated TV Shows" items={topRatedTv} type="tv" />
<RenderCarousel title="Popular TV Shows" items={popularTv} type="tv" />
<RenderCarousel title="New Releases" items={newReleases} type="movie" />
<RenderCarousel title="Action & Adventure" items={actionMovies} type="movie" />
<RenderCarousel title="Comedy" items={comedyMovies} type="movie" />
<RenderCarousel title="Drama" items={dramaMovies} type="movie" />
<RenderCarousel title="Comedy TV Shows" items={comedyTv} type="tv" />
<RenderCarousel title="Horror & Thriller" items={horrorMovies} type="movie" />
<RenderCarousel title="Romance" items={romanceMovies} type="movie" />
<RenderCarousel title="Top Rated TV Shows" items={topRated} type="movie" />
<RenderCarousel title="Sci-Fi & Fantasy TV Shows" items={scifiTv} type="tv" />
<RenderCarousel title="Science Fiction & Fantasy" items={scifiMovies} type="movie" />
<RenderCarousel title="Mystery & Crime" items={mysteryMovies} type="movie" />
<RenderCarousel title="Drama TV Shows" items={dramaTv} type="tv" />
<RenderCarousel title="Family & Animation" items={familyMovies} type="movie" />
<RenderCarousel title="Documentaries" items={documentaries} type="movie" />
<RenderCarousel title="Trending TV Shows" items={trendingTv} type="tv" />
<RenderCarousel title="Anime" items={animeMovies} type="movie" />


                  </section>            
                  </div>


              
            </div>
          </main>
        } />

        {/* Description Route */}
        <Route path='/series/watch/:id' element={<SeriesWatchPage />} />
        <Route path='/series/:id' element={<DescriptionForShows />} />
        <Route path='/movie/:id'  element={<Description />}/>
        <Route path='/watch/:id'  element={<WatchPage />}/>
        <Route path="/about-us/" element={<About />}/>
        <Route path="/Search" element={<SearchRoute />} />

      </Routes>
        </Router>
      </div>
    </>
  );
};

export default App;
