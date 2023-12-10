import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import '../App.css';
import YouTube from 'react-youtube';

function App() {
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/w1280/';

  const API_KEY = '517b052a4f931bad1801acfa9e9ff07e';
  const API_URL = 'https://api.themoviedb.org/3/';

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [selectedMovie, setSelectedMovie] = useState({});
  const [playTrailer, setPlayTrailer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async searchKey => {
    const type = searchKey ? 'search' : 'discover';
    try {
      setIsLoading(true);
      const {
        data: { results },
      } = await axios.get(`${API_URL}/${type}/movie`, {
        params: {
          api_key: API_KEY,
          query: searchKey,
        },
      });
      setMovies(results);
      if (results.length > 0) {
        await selectMovie(results[0].id);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovie = async id => {
    try {
      const { data } = await axios.get(`${API_URL}/movie/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: 'videos',
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const selectMovie = async movieId => {
    setPlayTrailer(false);
    const data = await fetchMovie(movieId);
    setSelectedMovie(data);
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderMovies() {
    return movies.map(movie => (
      <MovieCard
        key={movie.id}
        movie={movie}
        selectMovie={() => selectMovie(movie.id)}
      />
    ));
  }

  const searchMovies = e => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(
      vid => vid.name === 'Official Trailer'
    );
    const key = trailer ? trailer.key : selectedMovie.videos.results[0].key;
    return (
      <YouTube
        videoId={key}
        className={'you-cont'}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            controls: 0,
          },
        }}
      />
    );
  };

  return (
    <div className="App">
      <header className={'header'}>
        {isLoading && (
          <div className={'wrapper'}>
            <div className={'circle'}></div>
            <div className={'circle'}></div>
            <div className={'circle'}></div>
            <div className={'shadow'}></div>
            <div className={'shadow'}></div>
            <div className={'shadow'}></div>
          </div>
        )}
        <div className={'header-content max-center'}>
          {playTrailer ? (
            <button
              className={'button close-btn'}
              onClick={() => setPlayTrailer(false)}
            >
              Close
            </button>
          ) : null}
          <span>Movie Trailer</span>
          <form onSubmit={searchMovies}>
            <input
              type="text"
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
            ></input>
            <button type={'submit'}>Search</button>
          </form>
        </div>
      </header>
      <div
        className="hero"
        style={{
          backgroundImage: `url(${IMAGE_PATH}/${selectedMovie.backdrop_path})`,
        }}
      >
        <div className="hero-content max-center">
          {selectedMovie.videos && playTrailer ? renderTrailer() : null}
          {selectedMovie.videos && selectedMovie.videos.results.length > 0 && (
            <button className={'button'} onClick={() => setPlayTrailer(true)}>
              Play Trailer
            </button>
          )}
          <h1 className={'hero-title'}>{selectedMovie.title}</h1>
          <p className={'hero-overview'}>
            {selectedMovie.overview ? selectedMovie.overview : null}
          </p>
        </div>
      </div>
      <div className="container max-center">{renderMovies()}</div>
    </div>
  );
}

export default App;
