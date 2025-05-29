import axios from 'axios';
import { useState, useContext } from 'react';
import { CustomPokemonContext } from '../../context/CustomPokemonContext';

const AddCustomPokemonModal = ({ isOpen, onClose }) => {
  const { fetchCustomPokemonList } = useContext(CustomPokemonContext);
  const [pokemon, setPokemon] = useState({
    name: '',
    types: ['', ''],
    imageUrl: '',
  });
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type1' || name === 'type2') {
      const index = name === 'type1' ? 0 : 1;
      setPokemon((prev) => ({
        ...prev,
        types: prev.types.map((type, i) => (i === index ? value : type)),
      }));
    } else {
      setPokemon((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!image) {
        setError('Please select an image to upload');
        setLoading(false);
        return;
      }

      const imageData = new FormData();
      imageData.append('file', image);
      imageData.append('upload_preset', 'myImages');
      imageData.append('cloud_name', 'dfy6lbeqz');

      const { data: cloudinaryData } = await axios.post(
        'https://api.cloudinary.com/v1_1/dfy6lbeqz/image/upload',
        imageData
      );

      const imageUrl = cloudinaryData.url;
      setUrl(imageUrl);
      setPokemon((prev) => ({ ...prev, imageUrl }));

      const { data: pokemonData } = await axios.post('api/v1/custom-pokemon', {
        name: pokemon.name,
        types: pokemon.types.filter((type) => type !== ''),
        imageUrl,
      });

      setPokemon({ name: '', types: ['', ''], imageUrl: '' });
      setImage(null);
      setUrl('');
      alert('Custom Pokémon added successfully!');
      console.log('Saved Custom Pokémon:', pokemonData);
      await fetchCustomPokemonList();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to add Custom Pokémon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pokemonTypes = [
    'Normal',
    'Fire',
    'Water',
    'Grass',
    'Electric',
    'Ice',
    'Fighting',
    'Poison',
    'Ground',
    'Flying',
    'Psychic',
    'Bug',
    'Rock',
    'Ghost',
    'Dark',
    'Dragon',
    'Steel',
    'Fairy',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Custom Pokémon</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Custom Pokémon Name
            </label>
            <input
              type="text"
              name="name"
              value={pokemon.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Enter Custom Pokémon name"
              required
            />
          </div>
          <div>
            <label htmlFor="type1" className="block text-sm font-medium">
              Pokémon Type 1
            </label>
            <select
              name="type1"
              value={pokemon.types[0]}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            >
              <option value="" disabled>
                Select Pokémon type 1
              </option>
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type2" className="block text-sm font-medium">
              Pokémon Type 2 (Optional)
            </label>
            <select
              name="type2"
              value={pokemon.types[1]}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="">None</option>
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium">
              Custom Pokémon Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded text-gray-800 bg-gray-300 hover:bg-gray-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`p-2 rounded text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 text-white rounded hover:bg-gray-900 cursor-pointer'
              }`}
            >
              {loading ? 'Adding Custom Pokémon...' : 'Add Custom Pokémon'}
            </button>
          </div>
        </form>
        {url && (
          <div className="mt-4">
            <p className="text-sm font-medium">Uploaded Image:</p>
            <img src={url} alt="Uploaded Custom Pokémon" className="mt-2 max-w-xs" />
            <p className="text-sm break-all">URL: {url}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCustomPokemonModal;
