import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import FilmCard from '../components/FilmCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const sliderConfig = (prevRef, nextRef) => ({
  modules: [Navigation],
  navigation: {
    prevEl: prevRef?.current,
    nextEl: nextRef?.current,
  },
  spaceBetween: 5,
  slidesPerView:2,
  breakpoints: {
    640: { slidesPerView: 3, spaceBetween: 8 },
    1024: { slidesPerView: 3, spaceBetween: 8 },
    1280: { slidesPerView: 4, spaceBetween: 6 },
    1536: { slidesPerView: 6, spaceBetween: 6 },
  },
  className: '!pb-8',
})


const apiKey = process.env.NEXT_PUBLIC_API_TOKEN;
const api = process.env.NEXT_PUBLIC_TMDB_API;

// Yardımcı fonksiyon: api_key'i query string'e ekle
function withApiKey(url) {

  if (!apiKey) return url;
  const sep = url.includes('?') ? '&' : '?';
  return url + sep + 'api_key=' + apiKey;
}

export default function Home() {
  const router = useRouter()
  const { genre, search } = router.query
  const [hero, setHero] = useState(null)
  const [trending, setTrending] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [topRated, setTopRated] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        // Arama öncelikli
        if (search) {
          const res = await fetch(withApiKey(`${api}/search/movie?query=${encodeURIComponent(search)}&language=tr`), {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          })
          const data = await res.json()
          setFiltered(data.results || [])
          setHero(data.results?.[0] || null)
          setTrending([])
          setNowPlaying([])
          setUpcoming([])
          setTopRated([])
        } else if (genre) {
          const res = await fetch(withApiKey(`${api}/discover/movie?with_genres=${genre}&language=tr`), {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          })
          const data = await res.json()
          setFiltered(data.results || [])
          setHero(data.results?.[0] || null)
          setTrending([])
          setNowPlaying([])
          setUpcoming([])
          setTopRated([])
        } else {
          const [trendRes, nowRes, upRes, topRes] = await Promise.all([
            fetch(withApiKey(`${api}/trending/movie/week?language=tr`), {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            }),
            fetch(withApiKey(`${api}/movie/now_playing?language=tr`), {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            }),
            fetch(withApiKey(`${api}/movie/upcoming?language=tr`), {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            }),
            fetch(withApiKey(`${api}/movie/top_rated?language=tr`), {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            }),
          ])
          const [trend, now, up, top] = await Promise.all([
            trendRes.json(),
            nowRes.json(),
            upRes.json(),
            topRes.json(),
          ])
          setTrending(trend.results || [])
          setNowPlaying(now.results || [])
          setUpcoming(up.results || [])
          setTopRated(top.results || [])
          setHero(trend.results?.[0] || null)
          setFiltered([])
        }
      } catch (err) {
        setError('API error')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [genre, search])

  if (loading) return <div className="py-24 text-center text-lg text-neutral-300">Yükleniyor...</div>
  if (error) return <div className="py-24 text-center text-lg text-red-400">Hata: {error}</div>

  // Eğer arama veya kategori varsa tek bir slider ile göster
  if (search || genre) {
    return (
      <div className="pb-16">
        {hero && (
          <div className="relative w-full h-[340px] sm:h-[420px] md:h-[520px] rounded-2xl overflow-hidden mb-10 flex items-end shadow-2xl" style={{ background: hero.backdrop_path ? `url(https://image.tmdb.org/t/p/original${hero.backdrop_path}) center/cover` : '#222' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-0" />
            <div className="relative z-10 p-6 sm:p-12 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2 drop-shadow-lg">{hero.title}</h1>
              <p className="text-neutral-200 text-base sm:text-lg mb-4 line-clamp-3 drop-shadow">{hero.overview}</p>
              <a href={`/movie/${hero.id}`} className="inline-block bg-yellow-400 text-neutral-900 font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-300 transition text-lg">Detaya Git</a>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <SectionSlider title={search ? `"${search}" için Sonuçlar` : 'Kategori Filmleri'} movies={filtered} />
        </div>
      </div>
    )
  }

  // Ana sayfa (default)
  return (
    <div className="pb-16">
      {hero && (
          <div className="relative w-full h-[340px] sm:h-[420px] md:h-[520px] rounded-2xl overflow-hidden mb-10 flex items-end shadow-2xl" style={{ background: hero.backdrop_path ? `url(https://image.tmdb.org/t/p/original${hero.backdrop_path}) center/cover` : '#222' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-0" />
            <div className="relative z-10 p-6 sm:p-12 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2 drop-shadow-lg">{hero.title}</h1>
              <p className="text-neutral-200 text-base sm:text-lg mb-4 line-clamp-3 drop-shadow">{hero.overview}</p>
              <a href={`/movie/${hero.id}`} className="inline-block bg-yellow-400 text-neutral-900 font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-300 transition text-lg">Detaya Git</a>
            </div>
          </div>
        )}
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        {/* HERO/BANNER */}
        
        {/* TRENDING */}
        <SectionSlider title="Trend Olanlar" movies={trending} />
        {/* NOW PLAYING */}
        <SectionSlider title="Şimdi Vizyonda" movies={nowPlaying} />
        {/* UPCOMING */}
        <SectionSlider title="Yakında" movies={upcoming} />
        {/* TOP RATED */}
        <SectionSlider title="En Çok Oy Alanlar" movies={topRated} />
      </div>
    </div>
  )
}

function SectionSlider({ title, movies }) {
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const [navigationReady, setNavigationReady] = useState(false)
  useEffect(() => {
    setNavigationReady(true)
  }, [])
  if (!movies?.length) return null
  return (
    <div className="mb-10 relative">
      <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 px-2 sm:px-0">{title}</h2>
      <div className="relative">
        {navigationReady && (
          <Swiper
            {...sliderConfig(prevRef, nextRef)}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
              swiper.navigation.init()
              swiper.navigation.update()
            }}
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <FilmCard movie={movie} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
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
  )
}