import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

export interface FetchMoviesParams {
  query: string;
  page?: number;
  includeAdult?: boolean;
  language?: string;
}

interface FetchMoviesResponse {
  results: Movie[];
}

export async function fetchMovies({
  query,
  page = 1,
  includeAdult = false,
  language = "en-US",
}: FetchMoviesParams): Promise<Movie[]> {
  const { data } = await api.get<FetchMoviesResponse>("/search/movie", {
    params: { query, page, include_adult: includeAdult, language },
  });
  return data.results;
}

export function buildImageUrl(path: string | null, size: "w500" | "original") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}
