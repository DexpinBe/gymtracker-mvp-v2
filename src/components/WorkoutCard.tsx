import { Link } from 'react-router-dom';
import type { Workout } from '../types/workout';
import { formatWorkoutDate } from '../utils/date';

type WorkoutCardProps = {
  workout: Workout;
};

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const setLabel = workout.sets.length === 1 ? 'serie' : 'series';

  return (
    <li>
      <Link to={`/entrenamiento/${workout.id}`} className="workout-card">
        <span className="workout-card__content">
          <span className="workout-card__date">{formatWorkoutDate(workout.date)}</span>
          <span className="workout-card__meta">
            {workout.sets.length} {setLabel}
          </span>
        </span>
        <span className="workout-card__arrow" aria-hidden>
          →
        </span>
      </Link>
    </li>
  );
}
