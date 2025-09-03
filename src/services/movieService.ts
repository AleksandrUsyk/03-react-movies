import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Movie } from "../types/movie";

const TMDB_BASE = "https://api.themoviedb.org/3";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN as string;

if (!TOKEN) {
  console.warn(
    "VITE_TMDB_TOKEN is missing. Set it in .env. Requests will fail without it."
  );
}

const http = axios.create({
  baseURL: TMDB_BASE,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

export interface SearchMoviesParams {
  query: string;
  page?: number;
  include_adult?: boolean;
  language?: string;
}

export interface SearchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  params: SearchMoviesParams
): Promise<SearchMoviesResponse> {
  const { query, page = 1, include_adult = false, language = "en-US" } = params;

  const res: AxiosResponse<SearchMoviesResponse> = await http.get(
    "/search/movie",
    {
      params: { query, page, include_adult, language },
    }
  );

  return res.data;
}

export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  const res: AxiosResponse<Movie> = await http.get(`/movie/${movieId}`, {
    params: { language: "en-US" },
  });
  return res.data;
}

export async function fetchTrendingMovies(): Promise<Movie[]> {
  const res: AxiosResponse<{ results: Movie[] }> = await http.get(
    "/trending/movie/week"
  );
  return res.data.results;
}
