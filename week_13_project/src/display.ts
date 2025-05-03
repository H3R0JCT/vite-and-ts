import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { runMovieForm } from './modal'; // Import the function to open the modal



// Define the `movie` type
type Movie = {
    id: number;
    title: string;
    genreId: number;
    ratingID: number;
};

// Define the `Genre` and `Rating` types
type Genre = {
    id: string;
    text: string;
};

type Rating = {
    id: string;
    text: string;
};

// Base URL for the API
const API_BASE_URL = 'http://localhost:3000';

// Endpoints for movies, genres, and ratings
const MOVIES_ENDPOINT = `${API_BASE_URL}/movies`;
const GENRES_ENDPOINT = `${API_BASE_URL}/genre`;
const RATINGS_ENDPOINT = `${API_BASE_URL}/rating`;
/**
 * Fetches movies, genres, and ratings from the API and displays them in a table.
 */
export async function fetchAndDisplayMovies(): Promise<void> {
    try {
        // Fetch movies, genres, and ratings data from the API
        const moviesResponse = await fetch(MOVIES_ENDPOINT);
        const genresResponse = await fetch(GENRES_ENDPOINT);
        const ratingsResponse = await fetch(RATINGS_ENDPOINT);

        // Parse the JSON responses
        const movies: Movie[] = await moviesResponse.json();
        const genres: Genre[] = await genresResponse.json();
        const ratings: Rating[] = await ratingsResponse.json();

        // Get the table body element where movies will be displayed
        const tableBody = document.getElementById("watchList") as HTMLTableSectionElement;
        if (!tableBody) {
            console.error('Table body element with id "watchList" not found.');
            return;
        }
        tableBody.innerHTML = ''; // Clear the table before adding new rows

        // Loop through each movie and create a table row
        movies.forEach((movie) => {
            // Find the genre and rating for the current movie
            const genre = genres.find((g) => g.id === movie.genreId.toString());
            const rating = ratings.find((r) => r.id === movie.ratingID.toString());

            // Create a new table row for the movie
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${movie.title}</td>
                <td>${genre ? genre.text : 'Unknown Genre'}</td>
                <td>${rating ? rating.text : 'No Rating'}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                    <button class="btn btn-success btn-sm watched-btn">Edit</button>
                </td>`;

            // Add delete functionality to the "Delete" button
            const deleteButton = newRow.querySelector(".delete-btn") as HTMLButtonElement;
            deleteButton.addEventListener("click", async () => {
                try {
                    // Send a DELETE request to remove the movie from the database
                    await fetch(`${MOVIES_ENDPOINT}/${movie.id}`, { method: 'DELETE' });
                    tableBody.removeChild(newRow); // Remove the row from the table
                } catch (error) {
                    console.error('Error deleting movie:', error);
                    alert('Failed to delete the movie. Please try again.');
                }
            });

            // Add edit functionality to the "Edit" button
            const editButton = newRow.querySelector(".watched-btn") as HTMLButtonElement;
            editButton.addEventListener("click", () => {
                runMovieForm(movie); // Pass the movie object to pre-fill the modal
            });

            // Append the new row to the table body
            tableBody.appendChild(newRow);
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        alert('Failed to fetch movies. Please try again.');
    }
}