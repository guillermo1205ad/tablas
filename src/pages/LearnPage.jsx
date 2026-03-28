import { useEffect, useState } from 'react';
import TableCard from '../components/TableCard';
import TableSelector from '../components/TableSelector';
import { STUDY_STRATEGIES, TABLE_TIPS } from '../data/tables';

function LearnPage({ initialTable = 1, onPracticeTable, onNavigate }) {
  const [selectedTable, setSelectedTable] = useState(initialTable);

  useEffect(() => {
    setSelectedTable(initialTable);
  }, [initialTable]);

  const tip = TABLE_TIPS[selectedTable];
  const strategy = STUDY_STRATEGIES[(selectedTable - 1) % STUDY_STRATEGIES.length];

  const goToPreviousTable = () => {
    setSelectedTable((prev) => (prev === 1 ? 12 : prev - 1));
  };

  const goToNextTable = () => {
    setSelectedTable((prev) => (prev === 12 ? 1 : prev + 1));
  };

  return (
    <section className="learn-page">
      <header className="section-heading card">
        <h2>Aprender tablas</h2>
        <p>
          Explora cada tabla con patrones utiles para memorizar mejor y reducir errores frecuentes.
        </p>
      </header>

      <div className="learn-controls card">
        <button type="button" className="btn btn-ghost" onClick={goToPreviousTable}>
          Tabla anterior
        </button>

        <TableSelector selected={selectedTable} onChange={setSelectedTable} />

        <button type="button" className="btn btn-ghost" onClick={goToNextTable}>
          Tabla siguiente
        </button>
      </div>

      <div className="learn-grid">
        <TableCard tableNumber={selectedTable} />

        <aside className="card learn-aside">
          <h3>Tip pedagogico</h3>
          <p>{tip.short}</p>

          <h4>Patron para observar</h4>
          <p>{tip.pattern}</p>

          <h4>Estrategia recomendada</h4>
          <p>{strategy}</p>

          <div className="learn-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onPracticeTable(selectedTable)}
            >
              Practicar tabla {selectedTable}
            </button>
            <button type="button" className="btn btn-soft" onClick={() => onNavigate('levels')}>
              Ir a niveles
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default LearnPage;
