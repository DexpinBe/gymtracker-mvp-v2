import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="entrenamiento/nuevo" element={<NewWorkoutPage />} />
          <Route path="entrenamiento/:id" element={<WorkoutDetailPage />} />
          <Route path="historial" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
