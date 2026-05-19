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

const emptyForm: SetInput = {
  exerciseName: '',
  setNumber: 1,
  reps: 0,
  weightKg: 0,
};

export default function SetForm({
  workoutSets,
  prefillExercise,
  prefillKey,
  onAdd,
}: SetFormProps) {
  const datalistId = useId();
  const repsRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<SetInput>(emptyForm);
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

    setForm((prev) => ({
      ...prev,
      exerciseName: trimmed,
      setNumber: suggestions.setNumber,
      reps: suggestions.reps,
      weightKg: suggestions.weightKg,
    }));
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

    const input: SetInput = {
      exerciseName: form.exerciseName.trim(),
      setNumber: Number(form.setNumber),
      reps: Number(form.reps),
      weightKg: Number(form.weightKg),
    };

    const result = validateSetInput(input);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    onAdd(input);

    const nextSuggestions = getExerciseSuggestions(
      [...workoutSets, { id: 'pending', ...input }],
      loadWorkouts(),
      input.exerciseName,
    );

    if (nextSuggestions) {
      setForm({
        exerciseName: input.exerciseName,
        setNumber: nextSuggestions.setNumber,
        reps: nextSuggestions.reps,
        weightKg: nextSuggestions.weightKg,
      });
      setHint(formatSuggestionHint(nextSuggestions));
    } else {
      setForm({ ...emptyForm, exerciseName: input.exerciseName });
      setHint('');
    }

    setError('');
    repsRef.current?.focus();
  }

  return (
    <form className="set-form" onSubmit={handleSubmit}>
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
          required
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
            value={form.setNumber}
            onChange={(e) => setForm({ ...form, setNumber: Number(e.target.value) })}
            required
          />
        </label>

        <label className="form-field">
          <span>Reps</span>
          <input
            ref={repsRef}
            type="number"
            inputMode="numeric"
            min={0}
            value={form.reps}
            onChange={(e) => setForm({ ...form, reps: Number(e.target.value) })}
            required
          />
        </label>

        <label className="form-field">
          <span>Peso (kg)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.5"
            value={form.weightKg}
            onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
            required
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
