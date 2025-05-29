import mongoose from 'mongoose';

const customPokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  type: {
    type: [String],
    enum: [
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
    ],
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 1 && v.length <= 2;
      },
      message: 'A Pokémon must have 1 or 2 types only.',
    },
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const customPokemon = mongoose.model('CustomPokemon', customPokemonSchema);

export default customPokemon;
