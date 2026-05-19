import { useNavigate } from 'react-router-dom';
import WorkoutCard from '../components/WorkoutCard';
import { createWorkout, loadWorkouts } from '../storage/gymStorage';
import { todayISO } from '../utils/date';
import { sortWorkoutsByDate } from '../utils/workouts';

export default function HomePage() {
  const navigate = useNavigate();
  const recentWorkouts = sortWorkoutsByDate(loadWorkouts()).slice(0, 5);

  function handleCreateToday() {
    const workout = createWorkout(todayISO());
    navigate(`/entrenamiento/${workout.id}`);
  }

  return (
    <section className="page">
      <h1>Inicio</h1>

      <button type="button" className="btn btn--primary" onClick={handleCreateToday}>
        Crear entrenamiento de hoy
      </button>

      {recentWorkouts.length === 0 ? (
        <p className="empty-state">
          Aún no tienes entrenamientos registrados. Crea el primero con el botón de arriba.
        </p>
      ) : (
        <>
          <h2 className="section-title">Últimos entrenamientos</h2>
          <ul className="workout-list">
            {recentWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
