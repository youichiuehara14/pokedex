import { Routes, Route } from 'react-router-dom';

import CustomPokemonPage from './pages/CustomPokemonPage';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<CustomPokemonPage />} />
      </Routes>
    </div>
  );
};

export default App;
