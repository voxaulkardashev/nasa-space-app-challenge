import type { DatasetEntry } from '../data/analogOverview';

interface DatasetListProps {
  datasets: DatasetEntry[];
}

/** NASA datasets / instruments relevant to analog science, each with its source; debated results are tagged. */
export function DatasetList({ datasets }: DatasetListProps) {
  return (
    <ul className="dataset-list">
      {datasets.map((d) => (
        <li key={d.id} className="dataset-list__item">
          <div className="dataset-list__head">
            <span className="dataset-list__name">{d.name}</span>
            {d.debated && <span className="dataset-list__debated">Debated</span>}
          </div>
          <span className="dataset-list__mission">{d.mission}</span>
          <p className="dataset-list__what">{d.what}</p>
          {d.debated && <p className="dataset-list__debate-note">{d.debated}</p>}
          <a href={d.source.url} target="_blank" rel="noreferrer" className="dataset-list__source">
            {d.source.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
