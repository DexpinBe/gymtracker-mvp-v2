export type SetInput = {
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number;
};

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateSetInput(input: SetInput): ValidationResult {
  if (!input.exerciseName.trim()) {
    return { ok: false, message: 'El nombre del ejercicio no puede estar vacío.' };
  }

  if (input.setNumber < 1) {
    return { ok: false, message: 'El número de serie debe ser al menos 1.' };
  }

  if (input.reps < 0) {
    return { ok: false, message: 'Las repeticiones no pueden ser negativas.' };
  }

  if (input.weightKg < 0) {
    return { ok: false, message: 'El peso no puede ser negativo.' };
  }

  return { ok: true };
}
