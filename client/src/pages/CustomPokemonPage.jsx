import { useState, useEffect, useContext } from 'react';
import EditCustomPokemonModal from '../components/modals/EditCustomPokemonModal';
import { CustomPokemonContext } from '../context/CustomPokemonContext';
import AddCustomPokemonModal from '../components/modals/AddCustomPokemonModal';
import axios from 'axios';
import { Pencil, X } from 'lucide-react';

const CustomPokemonPage = () => {
  const { customPokemonList, fetchCustomPokemonList, loading, error } =
    useContext(CustomPokemonContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: '', success: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pokemonToEdit, setPokemonToEdit] = useState(null);

  useEffect(() => {
    fetchCustomPokemonList();
  }, [fetchCustomPokemonList]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEditClick = (pokemon) => {
    setPokemonToEdit(pokemon);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setPokemonToEdit(null);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    setDeleteStatus({ loading: true, error: '', success: '' });
    try {
      await axios.delete(`api/v1/custom-pokemon/${id}`);
      setDeleteStatus({
        loading: false,
        error: '',
        success: `Custom Pokémon ${name} deleted successfully!`,
      });
      await fetchCustomPokemonList();
    } catch (error) {
      console.error('Error deleting Custom Pokémon:', error);
      setDeleteStatus({
        loading: false,
        error: error.response?.data?.message || 'Failed to delete Custom Pokémon.',
        success: '',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Pokédex</h1>
      <button
        onClick={openModal}
        className="mb-6 p-2 rounded bg-gray-800 text-white  hover:bg-gray-900  cursor-pointer"
      >
        Add A Pokemon
      </button>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {deleteStatus.error && <p className="text-red-500 mb-4">{deleteStatus.error}</p>}
      {deleteStatus.success && <p className="text-green-500 mb-4">{deleteStatus.success}</p>}
      {customPokemonList.length === 0 && !loading && !error && (
        <p className="text-gray-500">No Custom Pokémon found. Create some!</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {customPokemonList.map((pokemon) => (
          <div key={pokemon._id} className="border rounded p-4 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold flex justify-between items-center">
              {pokemon.name}
              <div className="flex gap-2">
                <Pencil
                  className="w-5 h-5 text-gray-800 hover:text-gray-900 cursor-pointer"
                  onClick={() => handleEditClick(pokemon)}
                />
                <X
                  className={`w-5 h-5 ${
                    deleteStatus.loading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-800 hover:text-gray-900 cursor-pointer'
                  }`}
                  onClick={() => !deleteStatus.loading && handleDelete(pokemon._id, pokemon.name)}
                />
              </div>
            </h2>
            <p className="text-sm text-gray-600">Types: {pokemon.type.join(', ') || 'None'}</p>
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="mt-2 max-w-full h-40 object-contain"
            />
          </div>
        ))}
      </div>
      <AddCustomPokemonModal isOpen={isModalOpen} onClose={closeModal} />
      <EditCustomPokemonModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        pokemon={pokemonToEdit}
        onSave={fetchCustomPokemonList}
      />
    </div>
  );
};

export default CustomPokemonPage;
