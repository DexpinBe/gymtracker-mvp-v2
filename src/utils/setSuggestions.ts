import type { Workout, WorkoutSet } from '../types/workout';
import { sortWorkoutsByDate } from './workouts';

function normalizeExerciseKey(name: string): string {
  return name.trim().toLowerCase();
}

export function getUniqueExerciseNames(workouts: Workout[]): string[] {
  const names = new Set<string>();

  for (const workout of workouts) {
    for (const set of workout.sets) {
      const name = set.exerciseName.trim();
      if (name) {
        names.add(name);
      }
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b, 'es'));
}

function getLastSetForExercise(
  workouts: Workout[],
  exerciseName: string,
): WorkoutSet | undefined {
  const key = normalizeExerciseKey(exerciseName);
  if (!key) {
    return undefined;
  }

  for (const workout of sortWorkoutsByDate(workouts)) {
    for (let i = workout.sets.length - 1; i >= 0; i--) {
      const set = workout.sets[i];
      if (normalizeExerciseKey(set.exerciseName) === key) {
        return set;
      }
    }
  }

  return undefined;
}

export type ExerciseSuggestions = {
  setNumber: number;
  reps: number;
  weightKg: number;
  fromCurrentWorkout: boolean;
};

export function getExerciseSuggestions(
  workoutSets: WorkoutSet[],
  allWorkouts: Workout[],
  exerciseName: string,
): ExerciseSuggestions | null {
  const key = normalizeExerciseKey(exerciseName);
  if (!key) {
    return null;
  }

  const currentSets = workoutSets.filter(
    (set) => normalizeExerciseKey(set.exerciseName) === key,
  );

  const setNumber =
    currentSets.length === 0
      ? 1
      : Math.max(...currentSets.map((set) => set.setNumber)) + 1;

  if (currentSets.length > 0) {
    const last = currentSets.reduce((a, b) => (a.setNumber >= b.setNumber ? a : b));
    return {
      setNumber,
      reps: last.reps,
      weightKg: last.weightKg,
      fromCurrentWorkout: true,
    };
  }

  const lastGlobal = getLastSetForExercise(allWorkouts, exerciseName);
  if (lastGlobal) {
    return {
      setNumber: 1,
      reps: lastGlobal.reps,
      weightKg: lastGlobal.weightKg,
      fromCurrentWorkout: false,
    };
  }

  return { setNumber: 1, reps: 0, weightKg: 0, fromCurrentWorkout: false };
}

export function formatSuggestionHint(suggestions: ExerciseSuggestions): string {
  const { setNumber, reps, weightKg, fromCurrentWorkout } = suggestions;
  const source = fromCurrentWorkout ? 'este entrenamiento' : 'tu historial';
  const hasValues = reps > 0 || weightKg > 0;

  if (hasValues) {
    return `Serie ${setNumber} sugerida · ${reps} reps · ${weightKg} kg (${source})`;
  }

  return `Serie ${setNumber} sugerida`;
}
