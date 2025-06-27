import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import FilmCard from '../../components/FilmCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function MovieDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);


  const api = process.env.NEXT_PUBLIC_TMDB_API;
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
  useEffect(() => {
    if (!slug) return;
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${api}/movie/${slug}?append_to_response=credits&language=tr?}`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${api}/movie/${slug}/recommendations?language=tr`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setRecommendations(data.results || []);
      } catch {
        setRecommendations([]);
      }
    };
    fetchRecommendations();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-neutral-200">Yükleniyor...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-lg text-red-400">Hata: {error}</div>;
  if (!movie) return null;

  const bgUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;
  const genres = movie.genres?.map(g => g.name).join(', ');
  const year = movie.release_date?.slice(0, 4);
  const imdbUrl = movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}` : null;
  const director = movie.credits?.crew?.find(p => p.job === 'Director');
  const cast = movie.credits?.cast?.slice(0, 5).map(a => a.name).join(', ');

  return (
    <div
      className="min-h-screen w-full relative bg-neutral-950 text-white"
      style={bgUrl ? { backgroundImage: `linear-gradient(to bottom, rgba(20,20,20,0.85) 60%, #111), url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 px-4 py-12 relative z-10">
        {/* Poster */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no_photo.png'}
            alt={movie.title}
            className="rounded-2xl shadow-2xl w-64 h-auto object-cover border-4 border-neutral-800"
          />
        </div>
        {/* Detaylar */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-2">{movie.title} <span className="text-neutral-300 font-normal text-xl">({year})</span></h1>
          <div className="flex flex-wrap gap-3 items-center text-sm">
            <span className="bg-yellow-400 text-neutral-900 font-bold px-3 py-1 rounded-lg shadow">{movie.vote_average?.toFixed(1)}</span>
            {genres && <span className="bg-neutral-800 px-3 py-1 rounded-lg">{genres}</span>}
            {movie.runtime && <span className="bg-neutral-800 px-3 py-1 rounded-lg">{movie.runtime} dk</span>}
            {director && <span className="bg-neutral-800 px-3 py-1 rounded-lg">Yönetmen: {director.name}</span>}
          </div>
          <p className="text-neutral-200 text-base leading-relaxed mt-2">{movie.overview}</p>
          {cast && <div className="text-neutral-400 text-sm">Oyuncular: <span className="text-neutral-200">{cast}</span></div>}
          <div className="flex gap-4 mt-4">
            {imdbUrl && (
              <a href={imdbUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-400 text-neutral-900 font-bold px-5 py-2 rounded-lg shadow hover:bg-yellow-300 transition">IMDB</a>
            )}
            <a href="/" className="inline-block bg-neutral-800 text-neutral-200 font-semibold px-5 py-2 rounded-lg hover:bg-neutral-700 transition">Geri Dön</a>
          </div>
        </div>
      </div>
      {/* Önerilen Filmler Swiper Slider */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Önerilen Filmler</h2>
            <div className="relative">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                spaceBetween={2}
                slidesPerView={1.9}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 4 },
                  1536: { slidesPerView: 5 },
                }
              }
                className="!pb-8"
                style={{ background: 'rgba(30,30,30,0.95)', borderRadius: '1rem', padding: '2rem 0' }}
              >
                {recommendations.map((rec) => (
                  <SwiperSlide key={rec.id}>
                    <FilmCard movie={rec} />
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Custom navigation buttons */}
              <button
                ref={prevRef}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-400 hover:bg-yellow-500 text-neutral-900 shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition border-4 border-neutral-900"
                style={{ boxShadow: '0 2px 16px 0 #0008', cursor: 'pointer' }}
                aria-label="Önceki"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                ref={nextRef}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-400 hover:bg-yellow-500 text-neutral-900 shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition border-4 border-neutral-900"
                style={{ boxShadow: '0 2px 16px 0 #0008', cursor: 'pointer' }}
                aria-label="Sonraki"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Arka planı karartmak için overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-0 pointer-events-none" />
    </div>
  );
} 