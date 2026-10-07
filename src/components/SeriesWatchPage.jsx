import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { tmdbGet } from "../tmdb";
import Loading from "./LoadingPage";
import ErrorPage from "./Error";

const SeriesWatchPage = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [showError, setShowError] = useState(null);
  const [episodesError, setEpisodesError] = useState(null);
  const [episodesRetry, setEpisodesRetry] = useState(0);
  const [episodePanelOpen, setEpisodePanelOpen] = useState(true);

  useEffect(() => {
    let active = true;
    setShow(null);
    setShowError(null);
    tmdbGet(`https://api.themoviedb.org/3/tv/${id}?language=en-US`)
      .then(({ data }) => { if (active) setShow(data); })
      .catch((error) => { if (active) setShowError(error); });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    let active = true;
    if (!selectedSeason) {
      setEpisodes([]);
      return () => { active = false; };
    }
    setEpisodes([]);
    setEpisodesError(null);
    setEpisodesLoading(true);
    tmdbGet(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?language=en-US`)
      .then(({ data }) => { if (active) setEpisodes(data.episodes || []); })
      .catch((error) => { if (active) setEpisodesError(error); })
      .finally(() => { if (active) setEpisodesLoading(false); });
    return () => { active = false; };
  }, [selectedSeason, id, episodesRetry]);

  if (showError) {
    const code = showError.response?.status || (showError.request ? 503 : 500);
    return <ErrorPage code={code} title={code === 404 ? "Series not found" : "Couldn't load this series"} message={code === 404 ? "This series may no longer be available." : "We couldn't reach the series details."} steps={["Check your internet connection.", "Go back and try again."]} />;
  }
  if (!show) return <main className="watch-page watch-page-loading"><Loading /></main>;

  const seasons = show.seasons?.filter((season) => season.season_number > 0) || [];
  const currentEpisodeIndex = episodes.findIndex((episode) => episode.episode_number === selectedEpisode);
  const canGoPrevious = currentEpisodeIndex > 0;
  const canGoNext = currentEpisodeIndex >= 0 && currentEpisodeIndex < episodes.length - 1;
  return (
    <main className="watch-page series-watch-page">
      <header className="watch-page-header">
        <h1 className="watch-page-title">{show.name}</h1>
      </header>

      <div className={`series-viewer${episodePanelOpen ? " panel-open" : " panel-closed"}`}>
        <section className="series-main-column" aria-label="Episode player">
          {selectedEpisode ? (
            <div className="watch-player-wrap series-player-wrap">
              <iframe
            src={`https://vidsrc.sh/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
            title={`${show.name} — Season ${selectedSeason}, Episode ${selectedEpisode}`}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms"
            allowFullScreen
            className="watch-player"
              />
            </div>
          ) : (
            <div className="series-player-placeholder"><span aria-hidden="true">▶</span><strong>Choose an episode</strong><small>Select a season and episode to start watching.</small></div>
          )}
          <div className="episode-navigation">
            <button type="button" onClick={() => setSelectedEpisode(episodes[currentEpisodeIndex - 1]?.episode_number)} disabled={!canGoPrevious}>← Previous</button>
            <span>{selectedEpisode ? `Season ${selectedSeason} · Episode ${selectedEpisode}` : "No episode selected"}</span>
            <button type="button" onClick={() => setSelectedEpisode(episodes[currentEpisodeIndex + 1]?.episode_number)} disabled={!canGoNext}>Next →</button>
          </div>
        </section>
        <aside className={`series-picker${episodePanelOpen ? " is-open" : " is-closed"}`} aria-label="Choose an episode">
        <div className="picker-heading">
          <div><span className="picker-eyebrow">Browse episodes</span><h2>Seasons</h2></div>
          {selectedSeason && <span className="picker-selection">Season {selectedSeason}</span>}
        </div>
        <div className="season-list">
          {seasons.map((season) => (
            <button
              key={season.id}
              type="button"
              onClick={() => { setSelectedSeason(season.season_number); setSelectedEpisode(null); }}
              className={`season-button${selectedSeason === season.season_number ? " is-active" : ""}`}
              aria-pressed={selectedSeason === season.season_number}
            >
              <span>Season {season.season_number}</span>
              {season.episode_count ? <small>{season.episode_count} episodes</small> : null}
            </button>
          ))}
        </div>

        {selectedSeason && (
          <div className="episode-section">
            <div className="picker-heading episode-heading"><h2>Episodes</h2><span>{episodes.length || "—"}</span></div>
            {episodesLoading ? <p className="episode-empty">Loading episodes…</p> : episodesError ? (
              <ErrorPage inline code={episodesError.response?.status || (episodesError.request ? 503 : 500)} title="Episodes unavailable" message="We couldn't load this season's episodes." steps={["Check your internet connection.", "Retry loading this season."]} onRetry={() => setEpisodesRetry((attempt) => attempt + 1)} />
            ) : episodes.length ? (
              <div className="episode-list">
                {episodes.map((episode) => (
                  <button
                    key={episode.id}
                    type="button"
                    onClick={() => setSelectedEpisode(episode.episode_number)}
                    className={`episode-button${selectedEpisode === episode.episode_number ? " is-active" : ""}`}
                    aria-pressed={selectedEpisode === episode.episode_number}
                  >
                    <span className="episode-number">{String(episode.episode_number).padStart(2, "0")}</span>
                    <span className="episode-copy"><strong>{episode.name || `Episode ${episode.episode_number}`}</strong><small>{episode.overview || `Season ${selectedSeason} · Episode ${episode.episode_number}`}</small></span>
                    <span className="episode-play" aria-hidden="true">▶</span>
                  </button>
                ))}
              </div>
            ) : <p className="episode-empty">No episodes are available for this season.</p>}
          </div>
        )}
        </aside>
        <button
          type="button"
          className={`episode-panel-toggle${episodePanelOpen ? " is-open" : ""}`}
          onClick={() => setEpisodePanelOpen((open) => !open)}
          aria-expanded={episodePanelOpen}
          aria-label={episodePanelOpen ? "Collapse episode list" : "Expand episode list"}
        >
          <span aria-hidden="true">{episodePanelOpen ? "›" : "‹"}</span><span>Episodes</span>
        </button>
      </div>
      <Link className="watch-home-button text-decoration-none" to="/">Home</Link>
    </main>
  );
};

export default SeriesWatchPage;
