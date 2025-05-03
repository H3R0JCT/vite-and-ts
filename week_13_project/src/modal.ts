// Import necessary modules
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import { fetchAndDisplayMovies } from './display'; // Import the function to refresh the movie list

// Define the `movie` type
type Movie = {
    id: number;
    title: string;
    genreId: number;
    ratingID: number;
};

// Base URL for the API
const API_BASE_URL = 'http://localhost:3000';

// Endpoints for movies, genres, and ratings
const MOVIES_ENDPOINT = `${API_BASE_URL}/movies`;



/**
 * Opens the "Add Movie" modal and handles adding or editing a movie.
 * @param movie - The movie object to edit, or null to add a new movie.
 */
export async function runMovieForm(movie: Movie | null = null): Promise<void> {
    // Open the "Add Movie" modal
    const modalElement = document.getElementById('addMovieModal') as HTMLElement;
    const modal = new Modal(modalElement) as bootstrap.Modal;
    modal.show();

    // Pre-fill the form fields if editing a movie
    const movieTitleInput = document.getElementById('movieTitle') as HTMLInputElement;
    const movieGenreSelect = document.getElementById('movieGenre') as HTMLSelectElement;
    const movieRatingSelect = document.getElementById('movieRating') as HTMLSelectElement;
    const saveMovieButton = document.getElementById('saveMovie') as HTMLButtonElement;

    if (movie) {
        movieTitleInput.value = movie.title;
        movieGenreSelect.value = movie.genreId.toString();
        movieRatingSelect.value = movie.ratingID.toString();
        saveMovieButton.dataset.movieId = movie.id.toString();
        saveMovieButton.textContent = 'Update Movie';
    } else {
        movieTitleInput.value = '';
        movieGenreSelect.value = '';
        movieRatingSelect.value = '';
        saveMovieButton.removeAttribute('data-movie-id');
        saveMovieButton.textContent = 'Add Movie';
    }

    // Remove any existing event listeners from the "Save Movie" button
    const newSaveMovieButton = saveMovieButton.cloneNode(true) as HTMLButtonElement;
    saveMovieButton.parentNode?.replaceChild(newSaveMovieButton, saveMovieButton);

    // Add a new event listener to the "Save Movie" button
    newSaveMovieButton.addEventListener('click', async () => {
        const movieTitle = movieTitleInput.value.trim();
        const movieGenre = movieGenreSelect.value;
        const movieRating = movieRatingSelect.value;

        if (!movieTitle) {
            alert('Please fill out the movie title.');
            return;
        }

        const movieId = newSaveMovieButton.dataset.movieId;
        const movieData = {
            title: movieTitle,
            genreId: parseInt(movieGenre, 10) || 0,
            ratingID: parseInt(movieRating, 10) || 0,
        };

        try {
            if (movieId) {
                // Edit existing movie
                await fetch(`${MOVIES_ENDPOINT}/${movieId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(movieData),
                });
            } else {
                // Add new movie
                await fetch(MOVIES_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(movieData),
                });
            }

            // Close the modal and refresh the movie list
            modal.hide();
            fetchAndDisplayMovies();
        } catch (error) {
            console.error('Error saving movie:', error);
            alert('Failed to save the movie. Please try again.');
        }
    });
}