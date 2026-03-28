import { ALL_TABLE_NUMBERS } from '../data/tables';

function TableSelector({ selected, onChange, label = 'Selecciona una tabla', includeAllOption = false }) {
  return (
    <label className="table-selector">
      <span>{label}</span>
      <select value={selected} onChange={(event) => onChange(Number(event.target.value))}>
        {includeAllOption && <option value={0}>Todas las tablas</option>}
        {ALL_TABLE_NUMBERS.map((table) => (
          <option key={table} value={table}>
            Tabla del {table}
          </option>
        ))}
      </select>
    </label>
  );
}

export default TableSelector;
