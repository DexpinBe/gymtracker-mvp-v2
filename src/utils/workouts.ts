import type { Workout, WorkoutSet } from '../types/workout';

export function sortWorkoutsByDate(workouts: Workout[]): Workout[] {
  return [...workouts].sort((a, b) => b.date.localeCompare(a.date));
}

export function groupSetsByExercise(sets: WorkoutSet[]): [string, WorkoutSet[]][] {
  const grouped = sets.reduce<Record<string, WorkoutSet[]>>((acc, set) => {
    const key = set.exerciseName.trim();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(set);
    return acc;
  }, {});

  return Object.entries(grouped).map(([name, exerciseSets]) => [
    name,
    [...exerciseSets].sort((a, b) => a.setNumber - b.setNumber),
  ]);
}
