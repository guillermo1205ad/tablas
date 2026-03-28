import { TABLES, TABLE_TIPS } from '../data/tables';

function TableCard({ tableNumber }) {
  const table = TABLES.find((item) => item.table === tableNumber);
  const tip = TABLE_TIPS[tableNumber];

  if (!table) {
    return null;
  }

  return (
    <article className="table-card card">
      <header>
        <h3>Tabla del {tableNumber}</h3>
        <p>{tip.short}</p>
      </header>

      <ul className="facts-grid" aria-label={`Resultados de la tabla del ${tableNumber}`}>
        {table.facts.map((fact) => (
          <li key={`${fact.table}-${fact.multiplier}`}>
            <span>{fact.table} × {fact.multiplier}</span>
            <strong>{fact.result}</strong>
          </li>
        ))}
      </ul>

      <div className="pattern-note">
        <h4>Patron clave</h4>
        <p>{tip.pattern}</p>
      </div>
    </article>
  );
}

export default TableCard;
