import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PokemonDetail.css'; // Asegúrate de tener este archivo CSS

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(data => {
        setPokemon(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching the Pokémon details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pokemon) {
    return <div>No Pokémon found!</div>;
  }

  return (
    <div className="pokemondetail">
      <div className="pokemon-detail-content">
        <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pokemon-img" />
        <div className="pokemon-info">
          <h1 className="pokemon-name">{pokemon.name}</h1>
          <p className="pokemon-text">Height: {pokemon.height}</p>
          <p className="pokemon-text">Weight: {pokemon.weight}</p>
          <p className="pokemon-text">Types: {pokemon.types.map(type => type.type.name).join(', ')}</p>
          <p className="pokemon-text">Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
