import { useState, useEffect } from 'react';
import axios from 'axios';

const EditCustomPokemonModal = ({ isOpen, onClose, pokemon, onSave }) => {
  const [formData, setFormData] = useState({ name: '', types: '', imageUrl: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (pokemon) {
      setFormData({
        name: pokemon.name,
        types: pokemon.type.join(', '),
        imageUrl: pokemon.imageUrl,
      });
    }
  }, [pokemon]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        name: formData.name.trim(),
        types: formData.types.split(',').map((type) => type.trim()),
        imageUrl: formData.imageUrl.trim(),
      };

      await axios.put(`api/v1/custom-pokemon/${pokemon._id}`, updatedData);

      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Pokémon</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="types"
          placeholder="Types (comma separated)"
          value={formData.types}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="p-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-900 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomPokemonModal;
