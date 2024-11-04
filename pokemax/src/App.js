import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]); // Para el filtro de búsqueda
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Para el buscador
  const [selectedPokemon, setSelectedPokemon] = useState(null); 

  useEffect(() => {
    // Llamar a la API para obtener todos los Pokémon
    const fetchAllPokemons = async () => {
      try {
        let allPokemons = [];
        let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100';
        
        // Ciclo para obtener todos los Pokémon (la API está paginada)
        while (nextUrl) {
          const response = await fetch(nextUrl);
          const data = await response.json();
          allPokemons = [...allPokemons, ...data.results];
          nextUrl = data.next; // La URL de la siguiente página
        }

        // Obtener los detalles de cada Pokémon
        const pokemonPromises = allPokemons.map(pokemon =>
          fetch(pokemon.url).then(response => response.json())
        );
        const pokemonData = await Promise.all(pokemonPromises);
        
        setPokemons(pokemonData);
        setFilteredPokemons(pokemonData); // Inicialmente, todos los Pokémon están en la lista
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the Pokémon:', error);
        setLoading(false);
      }
    };

    fetchAllPokemons();
  }, []);

  // Manejo de búsqueda
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(value)
    );
    setFilteredPokemons(filtered);
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon); 
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="App" style={{ backgroundImage: "url(fondo.png)" }}>
  
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="logo.png" className="logo-img" alt="Pokemax Logo" />
          <h1 className='title'>Pokémax</h1>
        </div>

        <input
            type="text"
            className="search-input"
            placeholder="Buscar Pokémon"
            value={searchTerm}
            onChange={handleSearch}
          />
          
        {/* Alineación horizontal del campo de búsqueda y el botón */}
        <div className="navbar-right">
          <button className="boton-1">Iniciar Sesión</button>
        </div>
      </nav>

      <div className="container-pokemones">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon, index) => (
            <div
              key={index}
              className="contenido"
              onClick={() => handlePokemonClick(pokemon)} 
            >
              <h2>#{pokemon.id}</h2><h2>{pokemon.name}</h2>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <p>Altura: {pokemon.height/10}m</p>
              <p>Peso: {pokemon.weight/10}kg</p>
            </div>
          ))
        ) : (
          <p>Pokémon no encontrado</p>
        )}
      </div>

      {selectedPokemon && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&otimes;</span>
            <div className="pokemon-modal">
              <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} className="pokemon-modal-img" />
              <div className="pokemon-modal-info">
                <h2>{selectedPokemon.name}</h2>
                <p>Altura: {selectedPokemon.height/10}m</p>
                <p>Peso: {selectedPokemon.weight/10}kg</p>
                <p>Tipo(s): {selectedPokemon.types.map(type => type.type.name).join(', ')}</p>
                <p>Habilidades: {selectedPokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
