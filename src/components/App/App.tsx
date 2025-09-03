import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import toast from "react-hot-toast";

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [selected, setSelected] = useState<Movie | null>(null);

  const handleSearch = useCallback(async (nextQuery: string) => {
    setMovies([]);
    setError(null);

    if (!nextQuery.trim()) {
      toast("Please enter your search query.");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchMovies({
        query: nextQuery.trim(),
        language: "en-US",
      });

      if (!data.results.length) {
        toast("No movies found for your request.");
        setMovies([]);
        return;
      }

      setMovies(data.results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = useCallback((movie: Movie) => {
    setSelected(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelected(null);
  }, []);

  useEffect(() => {
    if (selected) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [selected]);

  const content = useMemo(() => {
    if (loading) return <Loader />;
    if (error) return <ErrorMessage />;
    if (movies.length > 0) {
      return <MovieGrid movies={movies} onSelect={handleSelect} />;
    }
    return null;
  }, [loading, error, movies, handleSelect]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <main className={styles.app}>{content}</main>

      {selected && <MovieModal movie={selected} onClose={handleCloseModal} />}
    </>
  );
};

export default App;
