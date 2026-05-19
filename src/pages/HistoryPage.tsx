import WorkoutCard from '../components/WorkoutCard';
import { loadWorkouts } from '../storage/gymStorage';
import { sortWorkoutsByDate } from '../utils/workouts';

export default function HistoryPage() {
  const workouts = sortWorkoutsByDate(loadWorkouts());

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title">Historial</h1>
        <p className="page-subtitle">Todos tus entrenamientos</p>
      </header>

      {workouts.length === 0 ? (
        <div className="card card--muted">
          <p className="empty-state">
            No hay entrenamientos en el historial. Crea uno desde Inicio o Nuevo entrenamiento.
          </p>
        </div>
      ) : (
        <ul className="workout-list">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </ul>
      )}
    </section>
  );
}
