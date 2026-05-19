import type { WorkoutSet } from '../types/workout';

type ExerciseGroupProps = {
  exerciseName: string;
  sets: WorkoutSet[];
  onAddSeries?: (exerciseName: string) => void;
};

export default function ExerciseGroup({ exerciseName, sets, onAddSeries }: ExerciseGroupProps) {
  return (
    <section className="exercise-group">
      <h3 className="exercise-group__title">{exerciseName}</h3>
      <ul className="set-list">
        {sets.map((set) => (
          <li key={set.id} className="set-item">
            Serie {set.setNumber}: {set.reps} reps · {set.weightKg} kg
          </li>
        ))}
      </ul>
      {onAddSeries && (
        <button
          type="button"
          className="btn-text"
          onClick={() => onAddSeries(exerciseName)}
        >
          + Añadir otra serie
        </button>
      )}
    </section>
  );
}
