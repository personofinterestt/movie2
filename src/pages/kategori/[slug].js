import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGenres } from '../../components/GenreContext';
import FilmCard from '../../components/FilmCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const sliderConfig = {
  modules: [Navigation],
  spaceBetween: 6,
  slidesPerView: 1.2,
  breakpoints: {
    640: { slidesPerView: 2.2, spaceBetween: 8 },
    1024: { slidesPerView: 3.2, spaceBetween: 8 },
    1280: { slidesPerView: 4.2, spaceBetween: 6 },
    1536: { slidesPerView: 5.2, spaceBetween: 6 },
  },
  className: '!pb-8',
};

function withApiKey(url) {
  const apiKey = process.env.NEXT_PUBLIC_API_TOKEN;
  if (!apiKey) return url;
  const sep = url.includes('?') ? '&' : '?';
  return url + sep + 'api_key=' + apiKey;
}
const api = process.env.NEXT_PUBLIC_TMDB_API;
const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

export default function KategoriPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { genres } = useGenres();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genreName, setGenreName] = useState('');

  useEffect(() => {
    if (!slug || !genres.length) return;
    const genre = genres.find(g => g.slug === slug);
    if (!genre) {
      setError('Kategori bulunamadı');
      setLoading(false);
      return;
    }
    setGenreName(genre.name);
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(withApiKey(`${api}/discover/movie?with_genres=${genre.id}&language=tr`), {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        setError('API error');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [slug, genres]);

  if (loading) return <div className="py-24 text-center text-lg text-neutral-300">Yükleniyor...</div>;
  if (error) return <div className="py-24 text-center text-lg text-red-400">Hata: {error}</div>;

  const hero = movies[0];
  const restMovies = movies.slice(1);

  return (
    <div>
         {hero && (
        <div className="relative w-full h-[340px] sm:h-[420px] md:h-[520px] rounded-2xl overflow-hidden mb-8 flex items-end shadow-2xl" style={{ background: hero.backdrop_path ? `url(https://image.tmdb.org/t/p/original${hero.backdrop_path}) center/cover` : '#222' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-0" />
          <div className="relative z-10 p-6 sm:p-12 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2 drop-shadow-lg">{hero.title}</h2>
            <p className="text-neutral-200 text-base sm:text-lg mb-4 line-clamp-3 drop-shadow">{hero.overview}</p>
            <a href={`/movie/${hero.id}`} className="inline-block bg-yellow-400 text-neutral-900 font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-300 transition text-lg">Detaya Git</a>
          </div>
        </div>
      )}
    <div className="pb-16 max-w-7xl mx-auto px-2 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-8 text-center">{genreName} Filmleri</h1>
   
      {restMovies.length > 0 ? (
        <div className="mb-10 relative">
          <Swiper {...sliderConfig}>
            {restMovies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <FilmCard movie={movie} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="text-center text-neutral-400">Bu kategoriye ait başka film bulunamadı.</div>
      )}
    </div>
    </div>
  );
} 