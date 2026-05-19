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
      <header className="page-header">
        <h1 className="page-title">Inicio</h1>
        <p className="page-subtitle">Resumen de tu actividad reciente</p>
      </header>

      <div className="card card--action">
        <button type="button" className="btn btn--primary" onClick={handleCreateToday}>
          Crear entrenamiento de hoy
        </button>
      </div>

      {recentWorkouts.length === 0 ? (
        <div className="card card--muted">
          <p className="empty-state">
            Aún no tienes entrenamientos registrados. Crea el primero con el botón de arriba.
          </p>
        </div>
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
