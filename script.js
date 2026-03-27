//const tmdbToken = process.env.TMDB_TOKEN;  // Not working in GitHub
const tmdbToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMDk5NGYzMjgxY2FiYzNlZDgxOWE3YjcwMGEzMjNhOCIsIm5iZiI6MTc3NDYwNzEzMy42MjUsInN1YiI6IjY5YzY1YjFkNWE0MDhkNDdmZTRkYzk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JPcosmQPcw6jHtnSpQyjAGmbRjg0NAepxHoLTZ0c654';
const tmdbBaseUrl = 'https://api.themoviedb.org/3/';
const playBtn = document.getElementById('playBtn'); // buton play

// async = funcție asincronă
const getGenres = async () => {
  // Endpoint pentru genuri
  const genreRequestEndpoint = '/genre/movie/list';
  
  // Parametrul cu cheia API -> gresit?: trebuie folosit Token
  //const requestParams = `?api_key=${tmdbKey}`;
  
  // Construiește URL-ul complet -> Gresit, trebuie fara api_key
  //const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;

  // Construiește URL-ul complet (fără api_key în URL)
  const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}`;  
  
  // Afișează URL-ul în consolă
  console.log('URL for genre:', urlToFetch);

  // Prinde eventualele erori
  try {
    // Trimite cererea cu header-ele corecte
    const response = await fetch(urlToFetch, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${tmdbToken}`  // ← autentificare nouă
      }
    });
    
    // Afișează statusul răspunsului (200 = succes)
    console.log('Status:', response.status);
    
    // Dacă răspunsul e ok (status 200-299)
    if (response.ok) {
      // Transformă răspunsul în JSON
      const jsonResponse = await response.json();
      
      // Afișează răspunsul complet
      console.log('JSON response:', jsonResponse);
      
      // Extrage doar array-ul de genuri
      const genres = jsonResponse.genres;
      
      // Afișează genurile
      console.log('Genres:', genres);
      
      // Returnează genurile
      return genres;
    }
  } catch(error) {
    // Afișează eroarea dacă apare
    console.log('HTTP Error:', error);
  }
};

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  // Endpoint-ul pentru descoperire filme
  const discoverMovieEndpoint = '/discover/movie';

// Construiește query string-ul cu parametrii
const requestParams = `?with_genres=${selectedGenre}`;
  
  // Construiește URL-ul complet
  const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;  
  console.log('URL for movie:', urlToFetch);

  try {
    // Trimite cererea cu header-ele corecte
    const response = await fetch(urlToFetch, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${tmdbToken}`  // ← autentificare nouă
      }
    });
    
    // Afișează statusul răspunsului (200 = succes)
    console.log('Status:', response.status);

    // Daca raspunsul este ok (status 200-299)
    if(response.ok) {

      // Transformă răspunsul în JSON
      const jsonResponse = await response.json();

      // Afișează răspunsul complet
      console.log('JSON response:', jsonResponse);

      // Extrage array cu movies
      const movies = jsonResponse.results;

      // Afișează movies
      console.log('Movies:', movies);
      
      // Returnează genurile
      return movies;
    } else {
      console.log('Response not OK:', response.status);
    }
  }
  catch(error) {
    // Afișează eroarea dacă apare
    console.log('HTTP Error:', error);
  }
};

const getMovieInfo = async (movie) => {
  // Extrage ID-ul filmului
  const movieId = movie.id;

  // Endpoint-ul pentru detalii film (înlocuiește {movie_id} cu ID-ul real)
  const movieEndpoint = `/movie/${movieId}`;

  // Construiește URL-ul (fără parametri, doar ID-ul)
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}`;

  console.log('URL details movie:', urlToFetch);

   try {
    const response = await fetch(urlToFetch, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${tmdbToken}`      // ← folosește token, nu api_key
      }
    });
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      const movieDetails = await response.json();
      console.log('Movie details:', movieDetails);
      return movieDetails;      // ← returnează detaliile
    } else {
      console.log('Error to movie read:', response.status);
    }
  } catch(error) {
    console.log('HTTP Error:', error);
  }
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };

  // Apelează getMovies() și așteaptă rezultatul
  const movies = await getMovies();

  // Selectează un film aleatoriu
  const randomMovie = getRandomMovie(movies);

  // Obține detaliile filmului
  const info = await getMovieInfo(randomMovie);

  // Afișează filmul în pagină
  displayMovie(info);

};

getGenres().then(populateGenreDropdown);
//playBtn.onclick = showRandomMovie;

/*playBtn.addEventListener('click', async () => {
  const movies = await getMovies();
  console.log('Movies recived:', movies);
  // aici ar trebui să afișezi filmele
});*/

// Rulează showRandomMovie când se apasă butonul
playBtn.addEventListener('click', () => {
  showRandomMovie();
});