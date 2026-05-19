import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorkout } from '../storage/gymStorage';
import { todayISO } from '../utils/date';

export default function NewWorkoutPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(todayISO());

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const workout = createWorkout(date);
    navigate(`/entrenamiento/${workout.id}`);
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title">Nuevo entrenamiento</h1>
        <p className="page-subtitle">Elige la fecha del entrenamiento</p>
      </header>

      <form className="card workout-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Fecha</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn btn--primary">
          Crear entrenamiento
        </button>
      </form>
    </section>
  );
}
