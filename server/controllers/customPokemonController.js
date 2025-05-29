import customPokemon from '../models/customPokemon.js';

export const createCustomPokemon = async (req, res) => {
  try {
    const { name, types, imageUrl } = req.body;
    if (!name || !types || !types.length || !imageUrl) {
      return res
        .status(400)
        .json({ message: 'Name, at least one type, and image URL are required' });
    }

    const newCustomPokemon = new customPokemon({
      name,
      type: types,
      imageUrl,
    });

    await newCustomPokemon.save();
    res.status(201).json(newCustomPokemon);
  } catch (error) {
    console.error('Error adding custom pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCustomPokemon = async (req, res) => {
  try {
    const customPokemonList = await customPokemon.find({});
    res.status(200).json(customPokemonList);
  } catch (error) {
    console.error('Error fetching custom pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCustomPokemonById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundPokemon = await customPokemon.findById(id);
    if (!foundPokemon) {
      return res.status(404).json({ message: 'Custom Pokémon not found' });
    }
    res.status(200).json(foundPokemon);
  } catch (error) {
    console.error('Error fetching Pokémon by ID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Pokémon ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const editCustomPokemon = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, types, imageUrl } = req.body;

    if (!name || !types || !types.length || !imageUrl) {
      return res
        .status(400)
        .json({ message: 'Name, at least one type, and image URL are required' });
    }

    if (types.length < 1 || types.length > 2) {
      return res.status(400).json({ message: 'Pokémon must have 1 or 2 types' });
    }

    const validTypes = [
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
    if (!types.every((type) => validTypes.includes(type))) {
      return res.status(400).json({ message: 'Invalid Pokémon type provided' });
    }

    const existingPokemon = await customPokemon.findOne({ name, _id: { $ne: id } });
    if (existingPokemon) {
      return res.status(400).json({ message: `Pokémon with name '${name}' already exists` });
    }

    const updatedPokemon = await customPokemon.findByIdAndUpdate(
      id,
      { name, type: types, imageUrl, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedPokemon) {
      return res.status(404).json({ message: 'Pokémon not found' });
    }

    res.status(200).json(updatedPokemon);
  } catch (error) {
    console.error('Error editing Pokémon:', {
      message: error.message,
      code: error.code,
      details: error.errors || error,
    });
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: `Pokémon with name '${req.body.name}' already exists` });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Pokémon ID' });
    }
    res.status(500).json({ message: 'Server error: Failed to edit Pokémon' });
  }
};

export const deleteCustomPokemon = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPokemon = await customPokemon.findByIdAndDelete(id);
    if (!deletedPokemon) {
      return res.status(404).json({ message: 'Custom Pokémon not found' });
    }
    res.status(200).json({ message: 'Custom Pokémon deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
