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
  const [selecdMovie, setSelecdMovie] = useState([]);
  const [playTrailer, setPlayTreiler] = useState(false);

  const fetchMovies = async searchKey => {
    const type = searchKey ? 'search' : 'discover';
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results);
    await selectMovie(results[0]);
  };
  const fetchMovie = async id => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'videos',
      },
    });
    return data;
  };

  const selectMovie = async movie => {
    const data = await fetchMovie(movie.id);
    setSelecdMovie(data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const renderMovies = () =>
    movies.map(movie => (
      <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} />
    ));

  const searchMovies = e => {
    e.preventDefault();
    fetchMovies(searchKey);
  };
  const renderTrailer = () => {
    const trailer = selecdMovie.videos.results.find(
      vid => vid.name === 'Official Trailer'
    );

    return <YouTube videoId={trailer.key} />;
  };

  return (
    <div className="App">
      <header className={'header'}>
        <div className={'header-content max-center'}>
          <span>Movie Trailer</span>
          <form onSubmit={searchMovies}>
            <input
              type="text"
              onChange={e => setSearchKey(e.target.value)}
            ></input>
            <button type={'submit'}>Search</button>
          </form>
        </div>
      </header>
      <div
        className="hero"
        style={{
          backgroundImage: `url(${IMAGE_PATH}/${selecdMovie.backdrop_path})`,
        }}
      >
        <div className="hero-content max-center">
          {selecdMovie.videos && playTrailer ? renderTrailer() : null}
          <button className={'button'} onClick={() => setPlayTreiler(true)}>
            Play Trailer
          </button>
          <h1 className={'hero-title'}>{selecdMovie.title}</h1>
          <p className={'hero-overview'}>
            {selecdMovie.overview ? selecdMovie.overview : null}
          </p>
        </div>
      </div>

      <div className="container max-center">{renderMovies()}</div>
    </div>
  );
}
export default App;
