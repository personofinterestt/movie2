import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef,useEffect} from 'react';
import { useGenres } from './GenreContext';

export default function Header() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeout = useRef();
  const { genres } = useGenres();

  // Dropdown dışına tıklanınca kapansın
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search)}`);
      setSearch('');
    }
  };

  const mainGenres = genres.slice(0, 6);
  const otherGenres = genres.slice(6);

  // Dropdown hover logic: gecikmeli kapanma
  const handleDropdownEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setDropdownOpen(true);
  };
  const handleDropdownLeave = () => {
    closeTimeout.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  return (
    <header className="sticky top-0 z-30 bg-neutral-900/95 border-b border-neutral-800 shadow-lg backdrop-blur font-['Montserrat']">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-3">
        {/* Logo ve isim */}
        <div className="flex items-center gap-2 text-2xl font-extrabold text-yellow-400 tracking-tight cursor-pointer">
          <Link href="/">
            <span>mestQUICKDB</span>
          </Link>
        </div>
        {/* Kategoriler */}
        <nav className="flex flex-wrap gap-3 justify-center items-center relative">
          {mainGenres.map((genre) => (
            <Link key={genre.id} href={`/kategori/${genre.slug}`} className="text-neutral-200 hover:text-yellow-400 font-semibold transition">
              {genre.name}
            </Link>
          ))}
          {otherGenres.length > 0 && (
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className="text-neutral-200 hover:text-yellow-400 font-semibold transition px-2 py-1 rounded-lg border border-neutral-700 bg-neutral-800 flex items-center gap-1"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                Diğerleri
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 9l6 6 6-6"/></svg>
              </button>
              {dropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-44 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-50 py-2"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  {otherGenres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/kategori/${genre.slug}`}
                      className="block px-4 py-2 text-neutral-200 hover:bg-yellow-400 hover:text-neutral-900 transition rounded"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
        {/* Arama */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Film ara..."
            className="px-3 py-2 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button type="submit" className="px-3 py-2 rounded-lg bg-yellow-400 text-neutral-900 font-bold hover:bg-yellow-300 transition">Ara</button>
        </form>
      </div>
    </header>
  );
} 