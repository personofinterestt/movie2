const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://pokeapi.co/api/v2/";

export async function fetcher(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) {
  }
  return res.json();
}

// Özel bir örnek fonksiyon
export async function getPokemons(params = {}) {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryString.append(key, value);
    }
  });

 return fetcher(`pokemon?${queryString.toString()}`);
}

export async function getPokemonDetail(name) {
  return fetcher(`pokemon/${name}`);
}

