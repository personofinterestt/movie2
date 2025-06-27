import { createContext, useContext, useEffect, useState } from 'react';

const GenreContext = createContext();

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function withApiKey(url) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) return url;
  const sep = url.includes('?') ? '&' : '?';
  return url + sep + 'api_key=' + apiKey;
}

export function GenreProvider({ children }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = process.env.NEXT_PUBLIC_TMDB_API;
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
  console.log("NEXT_PUBLIC_API_TOKEN:", typeof process.env.NEXT_PUBLIC_API_TOKEN, process.env.NEXT_PUBLIC_API_TOKEN);
console.log("NEXT_PUBLIC_TMDB_HEADER_TOKEN:", typeof process.env.NEXT_PUBLIC_TMDB_HEADER_TOKEN, process.env.NEXT_PUBLIC_TMDB_HEADER_TOKEN);
console.log("NEXT_PUBLIC_TMDB_API:", typeof process.env.NEXT_PUBLIC_TMDB_API, process.env.NEXT_PUBLIC_TMDB_API);
  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(withApiKey(`${api}/genre/movie/list?language=tr`), {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const genresWithSlug = (data.genres || []).map(g => ({ ...g, slug: slugify(g.name) }));
        setGenres(genresWithSlug);
      } catch (err) {
        setError('API error');
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return (
    <GenreContext.Provider value={{ genres, loading, error }}>
      {children}
    </GenreContext.Provider>
  );
}

export function useGenres() {
  return useContext(GenreContext);
} 