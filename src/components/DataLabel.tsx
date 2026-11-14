import type { DataValue } from '../data/types';
import { describeProvenance, STATUS_TEXT } from '../lib/provenance';

interface DataLabelProps {
  data: DataValue;
  /** Called when the badge is clicked (used to show/hide the source line). */
  onToggle?: () => void;
  expanded?: boolean;
}

/**
 * The shared Measured / Estimated / Placeholder badge.
 * Every value shown in the interface must be accompanied by one of these.
 */
export function DataLabel({ data, onToggle, expanded }: DataLabelProps) {
  const text = STATUS_TEXT[data.status];
  return (
    <button
      type="button"
      className={`data-label data-label--${data.status}`}
      title={describeProvenance(data)}
      aria-expanded={onToggle ? expanded : undefined}
      aria-label={`${text}. ${describeProvenance(data)}`}
      onClick={onToggle}
    >
      <span className="data-label__dot" aria-hidden="true" />
      {text}
    </button>
  );
}
