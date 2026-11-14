import { useState } from 'react';
import type { DataValue } from '../data/types';
import { DataLabel } from './DataLabel';

interface FactRowProps {
  data: DataValue;
}

/** One line of the info panel: label, value, data label, and an expandable source line. */
export function FactRow({ data }: FactRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <li className={`fact-row fact-row--${data.status}`}>
      <div className="fact-row__main">
        <span className="fact-row__label">{data.label}</span>
        <span className="fact-row__value">{data.value}</span>
        <DataLabel data={data} expanded={open} onToggle={() => setOpen((o) => !o)} />
      </div>
      {data.note && <div className="fact-row__note">{data.note}</div>}
      {open && (
        <div className="fact-row__source">
          {data.status === 'measured' && (
            <>
              Source:{' '}
              <a href={data.source.url} target="_blank" rel="noreferrer">
                {data.source.name}
              </a>{' '}
              · {data.source.sourceDate} · accessed {data.source.accessed}
            </>
          )}
          {data.status === 'estimated' && <>Method: {data.method}</>}
          {data.status === 'placeholder' && <>Not real data. {data.reason}</>}
        </div>
      )}
    </li>
  );
}
