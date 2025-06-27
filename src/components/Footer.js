import Link from 'next/link';
import { useGenres } from './GenreContext';

export default function Footer() {
  const { genres } = useGenres();
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 text-neutral-400 text-sm py-8 mt-12 font-['Montserrat']">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Sol: Site adı ve telif hakkı */}
        <div className="flex-1 flex items-center justify-center md:justify-start mb-2 md:mb-0">
          <span className="font-bold text-yellow-400 mr-2">mestQUICKDB</span>
          <span>&copy; {new Date().getFullYear()} Tüm hakları saklıdır.</span>
        </div>
        {/* Orta: Kategoriler */}
        <div className="flex-1 flex flex-wrap justify-center gap-2">
          {genres.slice(0, 32).map((genre) => (
            <Link key={genre.id} href={`/kategori/${genre.slug}`} className="px-3 py-1 rounded bg-neutral-800 hover:bg-yellow-400 hover:text-neutral-900 transition text-xs font-semibold">
              {genre.name}
            </Link>
          ))}
        </div>
     
      </div>
    </footer>
  );
} 