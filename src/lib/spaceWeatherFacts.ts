import type { DonkiSnapshot } from '../data/spaceWeather';
import type { DataValue, SourceRef } from '../data/types';

const day = (iso: string) => iso.slice(0, 10);

function donkiSource(snapshot: DonkiSnapshot, type: keyof DonkiSnapshot['sources']): SourceRef | null {
  const s = snapshot.sources[type];
  if (!s) return null;
  return {
    name: `NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information), via ${s.name}`,
    url: s.url,
    sourceDate: `Events from ${snapshot.window.start} to ${snapshot.window.end}`,
    accessed: day(snapshot.fetchedAt),
  };
}

function unavailable(id: string, label: string, snapshot: DonkiSnapshot): DataValue {
  return {
    id,
    label,
    value: 'Unavailable',
    status: 'placeholder',
    reason: `NASA's DONKI service did not return this data when the site was last updated (${day(snapshot.fetchedAt)}).`,
  };
}

/** Labelled rows for the space-weather section. Counts are catalogued events in DONKI. */
export function spaceWeatherFacts(snapshot: DonkiSnapshot): DataValue[] {
  const rows: DataValue[] = [];

  const flareSource = donkiSource(snapshot, 'FLR');
  if (snapshot.flares && flareSource) {
    const s = snapshot.flares.strongest;
    rows.push({
      id: 'flares',
      label: 'Solar flares',
      value: String(snapshot.flares.count),
      note: s ? `Strongest: class ${s.classType} on ${day(s.peakTime)}` : undefined,
      status: 'measured',
      source: flareSource,
    });
  } else {
    rows.push(unavailable('flares', 'Solar flares', snapshot));
  }

  const cmeSource = donkiSource(snapshot, 'CME');
  if (snapshot.cmes && cmeSource) {
    const f = snapshot.cmes.fastest;
    rows.push({
      id: 'cmes',
      label: 'Coronal mass ejections',
      value: String(snapshot.cmes.count),
      note: f ? `Fastest analysed speed about ${f.speedKmS.toLocaleString('en-US')} km/s (${day(f.time)})` : undefined,
      status: 'measured',
      source: cmeSource,
    });
  } else {
    rows.push(unavailable('cmes', 'Coronal mass ejections', snapshot));
  }

  const sepSource = donkiSource(snapshot, 'SEP');
  if (snapshot.sep && sepSource) {
    rows.push({
      id: 'sep',
      label: 'Solar energetic particle events',
      value: String(snapshot.sep.count),
      note: 'Bursts of fast particles from the Sun',
      status: 'measured',
      source: sepSource,
    });
  } else {
    rows.push(unavailable('sep', 'Solar energetic particle events', snapshot));
  }

  const gstSource = donkiSource(snapshot, 'GST');
  if (snapshot.storms && gstSource) {
    const k = snapshot.storms.maxKp;
    rows.push({
      id: 'storms',
      label: 'Geomagnetic storms at Earth',
      value: String(snapshot.storms.count),
      note: k ? `Strongest: Kp ${k.kp} on ${day(k.time)}` : undefined,
      status: 'measured',
      source: gstSource,
    });
  } else {
    rows.push(unavailable('storms', 'Geomagnetic storms at Earth', snapshot));
  }

  return rows;
}
