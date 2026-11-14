import type { DataValue } from '../data/types';

export const STATUS_TEXT = {
  measured: 'Measured',
  estimated: 'Estimated',
  placeholder: 'Placeholder',
} as const;

/** Plain-language explanation of where a value comes from. */
export function describeProvenance(data: DataValue): string {
  switch (data.status) {
    case 'measured':
      return `${data.source.name} (${data.source.sourceDate}; accessed ${data.source.accessed})`;
    case 'estimated':
      return `Estimated: ${data.method}`;
    case 'placeholder':
      return `Placeholder, not real data. ${data.reason}`;
  }
}
