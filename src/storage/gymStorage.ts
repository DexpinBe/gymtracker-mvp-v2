import type { Workout, WorkoutSet } from '../types/workout';

const KEY = 'gymtracker:workouts';

export function loadWorkouts(): Workout[] {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWorkouts(workouts: Workout[]): void {
  localStorage.setItem(KEY, JSON.stringify(workouts));
}

export function createWorkout(date: string): Workout {
  const workouts = loadWorkouts();

  const newWorkout: Workout = {
    id: crypto.randomUUID(),
    date,
    createdAt: new Date().toISOString(),
    sets: [],
  };

  workouts.push(newWorkout);
  saveWorkouts(workouts);

  return newWorkout;
}

export function getWorkoutById(id: string): Workout | undefined {
  return loadWorkouts().find((w) => w.id === id);
}

export function addSet(workoutId: string, set: Omit<WorkoutSet, 'id'>): void {
  const workouts = loadWorkouts();
  const workout = workouts.find((w) => w.id === workoutId);

  if (!workout) {
    return;
  }

  const newSet: WorkoutSet = {
    id: crypto.randomUUID(),
    ...set,
  };

  workout.sets.push(newSet);
  saveWorkouts(workouts);
}
