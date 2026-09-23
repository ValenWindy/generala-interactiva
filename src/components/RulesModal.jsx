import { CATEGORIES } from '../utils/scoring'
import '../styles/rules-modal.css'

const HOW_TO_GET = {
  ones: 'Suma de los dados que muestran 1',
  twos: 'Suma de los dados que muestran 2',
  threes: 'Suma de los dados que muestran 3',
  fours: 'Suma de los dados que muestran 4',
  fives: 'Suma de los dados que muestran 5',
  sixes: 'Suma de los dados que muestran 6',
  straight: '1-2-3-4-5 o 2-3-4-5-6',
  full: 'Tres dados iguales + dos dados iguales',
  poker: 'Cuatro dados iguales',
  generala: 'Los cinco dados iguales',
  'generala-doble': 'Cinco dados iguales, solo cuenta si ya anotaste una Generala antes',
}

const POINTS = {
  straight: '20 (25 servida)',
  full: '30 (35 servida)',
  poker: '40 (45 servida)',
  generala: '50 (55 servida)',
  'generala-doble': '100 (105 servida)',
}

export default function RulesModal({ onClose }) {
  return (
    <div className="rules-modal__overlay" onClick={onClose}>
      <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rules-modal__close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <h2 className="rules-modal__title">Cómo se juega</h2>

        <section className="rules-modal__section">
          <h3>El vaso y los dados</h3>
          <p>
            Agarrá el vaso y sacudilo para lanzar los 5 dados. Tenés hasta 3 lanzamientos por
            turno.
          </p>
          <p>
            Después de cada lanzamiento, tocá los dados que querés guardar y confirmá la
            selección: los que no elegiste vuelven al vaso para tirarlos de nuevo.
          </p>
        </section>

        <section className="rules-modal__section">
          <h3>Anotar</h3>
          <p>
            Cuando estés conforme con tu tirada, elegí una categoría del tablero para anotar el
            puntaje. Cada categoría solo se puede usar una vez, y la partida termina cuando se
            completaron las 11.
          </p>
        </section>

        <section className="rules-modal__section">
          <h3>Servida</h3>
          <p>
            Si lográs Escalera, Full, Poker, Generala o Generala Doble en el{' '}
            <strong>primer</strong> lanzamiento del turno (sin volver a tirar), sumás 5 puntos
            extra.
          </p>
        </section>

        <table className="rules-modal__table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Cómo se logra</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(({ id, label }) => (
              <tr key={id}>
                <td>{label}</td>
                <td>{HOW_TO_GET[id]}</td>
                <td>{POINTS[id] ?? 'Suma de esos dados'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
