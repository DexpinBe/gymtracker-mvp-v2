import WorkoutCard from '../components/WorkoutCard';
import { loadWorkouts } from '../storage/gymStorage';
import { sortWorkoutsByDate } from '../utils/workouts';

export default function HistoryPage() {
  const workouts = sortWorkoutsByDate(loadWorkouts());

  return (
    <section className="page">
      <h1>Historial</h1>

      {workouts.length === 0 ? (
        <p className="empty-state">
          No hay entrenamientos en el historial. Crea uno desde Inicio o Nuevo entrenamiento.
        </p>
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
