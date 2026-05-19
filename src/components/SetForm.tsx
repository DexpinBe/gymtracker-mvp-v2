import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { loadWorkouts } from '../storage/gymStorage';
import type { WorkoutSet } from '../types/workout';
import {
  formatSuggestionHint,
  getExerciseSuggestions,
  getUniqueExerciseNames,
} from '../utils/setSuggestions';
import type { SetInput } from '../utils/validation';
import { validateSetInput } from '../utils/validation';

type SetFormProps = {
  workoutSets: WorkoutSet[];
  prefillExercise?: string;
  prefillKey?: number;
  onAdd: (set: SetInput) => void;
};

type FormState = {
  exerciseName: string;
  setNumber: string;
  reps: string;
  weightKg: string;
};

const emptyForm: FormState = {
  exerciseName: '',
  setNumber: '',
  reps: '',
  weightKg: '',
};

function suggestionsToForm(
  exerciseName: string,
  suggestions: { setNumber: number; reps: number; weightKg: number },
): FormState {
  return {
    exerciseName,
    setNumber: String(suggestions.setNumber),
    reps: suggestions.reps > 0 ? String(suggestions.reps) : '',
    weightKg: suggestions.weightKg > 0 ? String(suggestions.weightKg) : '',
  };
}

function parseForm(form: FormState): { ok: true; input: SetInput } | { ok: false; message: string } {
  const exerciseName = form.exerciseName.trim();

  if (!exerciseName) {
    return { ok: false, message: 'El nombre del ejercicio no puede estar vacío.' };
  }

  if (form.setNumber.trim() === '') {
    return { ok: false, message: 'Indica el número de serie.' };
  }

  if (form.reps.trim() === '') {
    return { ok: false, message: 'Indica las repeticiones.' };
  }

  if (form.weightKg.trim() === '') {
    return { ok: false, message: 'Indica el peso.' };
  }

  const setNumber = Number(form.setNumber);
  const reps = Number(form.reps);
  const weightKg = Number(form.weightKg);

  if (Number.isNaN(setNumber) || Number.isNaN(reps) || Number.isNaN(weightKg)) {
    return { ok: false, message: 'Los valores numéricos no son válidos.' };
  }

  const input: SetInput = { exerciseName, setNumber, reps, weightKg };
  const result = validateSetInput(input);

  if (!result.ok) {
    return result;
  }

  return { ok: true, input };
}

export default function SetForm({
  workoutSets,
  prefillExercise,
  prefillKey,
  onAdd,
}: SetFormProps) {
  const datalistId = useId();
  const repsRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');

  const exerciseNames = getUniqueExerciseNames(loadWorkouts());

  function applySuggestions(exerciseName: string) {
    const trimmed = exerciseName.trim();
    if (!trimmed) {
      setHint('');
      return;
    }

    const suggestions = getExerciseSuggestions(workoutSets, loadWorkouts(), trimmed);
    if (!suggestions) {
      return;
    }

    setForm(suggestionsToForm(trimmed, suggestions));
    setHint(formatSuggestionHint(suggestions));
  }

  useEffect(() => {
    if (!prefillExercise || prefillKey === undefined) {
      return;
    }

    applySuggestions(prefillExercise);
    repsRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al pulsar "Añadir otra serie"
  }, [prefillKey]);

  function handleExerciseBlur() {
    if (form.exerciseName.trim()) {
      applySuggestions(form.exerciseName);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = parseForm(form);
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }

    onAdd(parsed.input);

    const nextSuggestions = getExerciseSuggestions(
      [...workoutSets, { id: 'pending', ...parsed.input }],
      loadWorkouts(),
      parsed.input.exerciseName,
    );

    if (nextSuggestions) {
      setForm(suggestionsToForm(parsed.input.exerciseName, nextSuggestions));
      setHint(formatSuggestionHint(nextSuggestions));
    } else {
      setForm({ ...emptyForm, exerciseName: parsed.input.exerciseName });
      setHint('');
    }

    setError('');
    repsRef.current?.focus();
  }

  return (
    <form className="card set-form" onSubmit={handleSubmit}>
      <h2 className="section-title">Añadir serie</h2>

      <label className="form-field">
        <span>Ejercicio</span>
        <input
          type="text"
          list={datalistId}
          value={form.exerciseName}
          placeholder="Ej: Press banca"
          autoComplete="off"
          onChange={(e) => setForm({ ...form, exerciseName: e.target.value })}
          onBlur={handleExerciseBlur}
        />
        <datalist id={datalistId}>
          {exerciseNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>

      <div className="form-row">
        <label className="form-field">
          <span>Serie</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="1"
            value={form.setNumber}
            onChange={(e) => setForm({ ...form, setNumber: e.target.value })}
          />
        </label>

        <label className="form-field">
          <span>Reps</span>
          <input
            ref={repsRef}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="0"
            value={form.reps}
            onChange={(e) => setForm({ ...form, reps: e.target.value })}
          />
        </label>

        <label className="form-field">
          <span>Peso (kg)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.5"
            placeholder="0"
            value={form.weightKg}
            onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
          />
        </label>
      </div>

      {hint && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn btn--primary">
        Guardar serie
      </button>
    </form>
  );
}
