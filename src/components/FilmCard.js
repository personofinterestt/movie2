import Link from 'next/link';

export default function FilmCard({ movie }) {
  return (
    <Link href={`/movie/${movie.id}`} className="group block w-48 bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-800 hover:scale-105 hover:shadow-2xl transition-transform duration-200">
      <div className="relative w-full h-72 bg-neutral-800 flex items-center justify-center">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:opacity-90 transition"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-neutral-400">No Image</div>
        )}
        <span className="absolute top-2 right-2 bg-yellow-400 text-neutral-900 text-xs font-bold px-2 py-1 rounded-lg shadow-md">{movie.vote_average?.toFixed(1)}</span>
      </div>
      <div className="p-3 flex flex-col gap-1">
        <h3 className="text-base font-bold text-white truncate" title={movie.title}>{movie.title}</h3>
        <p className="text-xs text-neutral-400">{movie.release_date?.slice(0, 4) || 'Yıl yok'}</p>
      </div>
    </Link>
  );
} 