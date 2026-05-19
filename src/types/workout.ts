export interface WorkoutSet {
  id: string;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number;
}

export interface Workout {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  sets: WorkoutSet[];
}
