import express from 'express';
import {
  createCustomPokemon,
  deleteCustomPokemon,
  editCustomPokemon,
  getAllCustomPokemon,
  getCustomPokemonById,
} from '../controllers/customPokemonController.js';

const router = express.Router();

router.post('/', createCustomPokemon);
router.get('/', getAllCustomPokemon);
router.get('/:id', getCustomPokemonById);
router.put('/:id', editCustomPokemon);
router.delete('/:id', deleteCustomPokemon);

export default router;
