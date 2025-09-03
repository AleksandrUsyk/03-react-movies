import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import css from "./ MovieModal.module.css";

import type { Movie } from "../../types/movie";
import { backdropUrl } from "../../utils/imageUrl";

export interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root") as HTMLElement;

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  const onEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onEsc]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      ref={backdropRef}
      onMouseDown={handleBackdropClick}
    >
      <div className={css.modal} role="document">
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        <img
          src={backdropUrl(movie.backdrop_path, "original") || undefined}
          alt={movie.title}
          className={css.image}
        />

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || "No overview available."}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || "—"}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average?.toFixed(1) ?? "—"}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default MovieModal;
