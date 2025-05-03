// Import necessary modules
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { runMovieForm } from './modal';
import { fetchAndDisplayMovies } from './display'; // Import the function to refresh the movie list



// Event listener for the "Add Movie" button to open the modal for adding a new movie
document.getElementById('add-movie')?.addEventListener('click', () => {
    runMovieForm(); // No movie object passed, so the modal is cleared
});

// Event listener for the "Fetch Movies" button to refresh the movie list
document.getElementById('fetch-movies')?.addEventListener('click', fetchAndDisplayMovies);

// Fetch and display movies when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayMovies);
