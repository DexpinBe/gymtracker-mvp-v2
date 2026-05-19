import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ExerciseGroup from '../components/ExerciseGroup';
import SetForm from '../components/SetForm';
import { addSet, getWorkoutById } from '../storage/gymStorage';
import { formatWorkoutDate } from '../utils/date';
import type { SetInput } from '../utils/validation';
import { groupSetsByExercise } from '../utils/workouts';

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [prefill, setPrefill] = useState<{ name: string; key: number } | undefined>();

  const workout = useMemo(() => {
    if (!id) {
      return undefined;
    }
    return getWorkoutById(id);
  }, [id, refreshKey]);

  if (!id || !workout) {
    return (
      <section className="page">
        <header className="page-header">
          <h1 className="page-title">Entrenamiento no encontrado</h1>
        </header>
        <div className="card card--muted">
          <p className="empty-state">No existe este entrenamiento o fue eliminado.</p>
        </div>
        <Link to="/" className="text-link">
          Volver al inicio
        </Link>
      </section>
    );
  }

  const workoutId = id;
  const exerciseGroups = groupSetsByExercise(workout.sets);

  function handleAddSet(set: SetInput) {
    addSet(workoutId, set);
    setRefreshKey((key) => key + 1);
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title workout-detail__title">{formatWorkoutDate(workout.date)}</h1>
        <p className="page-subtitle">
          {workout.sets.length} {workout.sets.length === 1 ? 'serie registrada' : 'series registradas'}
        </p>
      </header>

      {workout.sets.length === 0 ? (
        <div className="card card--muted">
          <p className="empty-state">Aún no hay series en este entrenamiento.</p>
        </div>
      ) : (
        <div className="exercise-groups">
          {exerciseGroups.map(([name, sets]) => (
            <ExerciseGroup
              key={name}
              exerciseName={name}
              sets={sets}
              onAddSeries={(name) => setPrefill({ name, key: Date.now() })}
            />
          ))}
        </div>
      )}

      <SetForm
        workoutSets={workout.sets}
        prefillExercise={prefill?.name}
        prefillKey={prefill?.key}
        onAdd={handleAddSet}
      />
    </section>
  );
}
