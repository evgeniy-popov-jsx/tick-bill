import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Routes as RoutesMap } from '../routes';
import { Home } from './presentation/pages/home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutesMap.Home} element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
