import { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const CustomPokemonContext = createContext();

export const CustomPokemonProvider = ({ children }) => {
  const [customPokemonList, setCustomPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCustomPokemonList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('http://localhost:5000/api/v1/custom-pokemon');
      setCustomPokemonList(data);
    } catch (error) {
      console.error('Error fetching Custom Pokémon:', error);
      setError(error.response?.data?.message || 'Failed to fetch Custom Pokémon.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CustomPokemonContext.Provider
      value={{ customPokemonList, fetchCustomPokemonList, loading, error }}
    >
      {children}
    </CustomPokemonContext.Provider>
  );
};
