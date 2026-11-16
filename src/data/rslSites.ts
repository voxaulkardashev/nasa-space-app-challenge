import type { MeasuredValue, SourceRef } from './types';

/**
 * Places on Mars where Recurring Slope Lineae (RSL) have been OBSERVED in
 * spacecraft images, for the RSL map (Hale Crater's Compare column) and the
 * "RSL observed" markers on the Explore globe and 2D map.
 *
 * Rules for this list (see docs/SOURCES.md, "RSL observation sites"):
 * - Only sites where a NASA image release says RSL are seen in that HiRISE image.
 *   No predicted, suspected or "candidate" sites.
 * - The marker is the centre of the cited HiRISE image, read from the HiRISE
 *   catalogue page for that image (planetocentric latitude, longitude 0–360° E).
 *   A HiRISE image is about 5–6 km wide and several km long, so the marker is
 *   precise to a few kilometres; it is not the exact position of each streak.
 * - Each site lists its sources: the NASA image page(s) and the HiRISE page.
 * - This is NOT a complete map: NASA says HiRISE has confirmed RSL "at more than
 *   50 sites"; we plot only the ones whose sources we could check.
 */

export interface RslSource {
  label: string;
  url: string;
}

export interface RslSite {
  id: string;
  name: string;
  /** Degrees north (negative = south): centre of the cited HiRISE image. */
  lat: number;
  /** Degrees east, 0–360 (the convention HiRISE and NASA captions use). */
  lonE: number;
  /** HiRISE observation used for the coordinates, and the date it was taken. */
  observation: { id: string; date: string; url: string };
  /** What the sources say was observed (paraphrased from the cited NASA captions). */
  description: string;
  sources: RslSource[];
  /** The featured site this observation belongs to (Hale Crater). */
  featuredId?: string;
}

const ACCESSED = '16 November 2026';

const pj = (pia: string, title: string, slug: string, date: string): RslSource => ({
  label: `NASA Photojournal ${pia} — ${title} (${date})`,
  url: `https://science.nasa.gov/photojournal/${slug}/`,
});

const hirise = (id: string, date: string) => ({ id, date, url: `https://www.uahirise.org/${id}` });

export const RSL_SITES: RslSite[] = [
  {
    id: 'rsl-hale',
    name: 'Hale Crater (central peaks)',
    lat: -35.677,
    lonE: 323.484,
    observation: hirise('ESP_038073_1440', '10 September 2014'),
    description:
      'Thousands of seasonal flows on steep slopes below bedrock outcrops in the central peaks; one of the most active RSL sites known. Hale’s RSL are unusually reddish and were already well developed in early southern spring.',
    sources: [
      pj('PIA19359', 'Seasonal Flows in the Central Mountains of Hale Crater', 'seasonal-flows-in-the-central-mountains-of-hale-crater', '8 Apr 2015'),
      pj('PIA17734', 'Active Slope Flows on the Central Hills of Hale Crater', 'active-slope-flows-on-the-central-hills-of-hale-crater', '29 May 2013'),
      pj('PIA19916', 'Recurring ‘Lineae’ on Slopes at Hale Crater, Mars', 'recurring-lineae-on-slopes-at-hale-crater-mars', '28 Sep 2015'),
      { label: 'HiRISE ESP_038073_1440 — Slope Monitoring in Hale Crater', url: 'https://www.uahirise.org/ESP_038073_1440' },
    ],
    featuredId: 'hale',
  },
  {
    id: 'rsl-palikir',
    name: 'Palikir Crater (inside Newton Crater)',
    lat: -41.637,
    lonE: 202.295,
    observation: hirise('ESP_021555_1380', '3 March 2011'),
    description:
      'Dark warm-season flows that extend down the crater wall from bedrock exposures. NASA’s August 2011 image release calls the site Newton crater; Palikir is a smaller crater inside Newton.',
    sources: [
      pj('PIA14473', 'Warm-Season Flows on Slope in Newton Crater, Five-Image Sequence', 'warm-season-flows-on-slope-in-newton-crater-five-image-sequence', '4 Aug 2011'),
      pj('PIA17933', 'Warm-Season Flows on Martian Slope (Palikir Crater)', 'warm-season-flows-on-martian-slope', '10 Feb 2014'),
      pj('PIA17727', 'Seasonal Flows in Palikir Crater', 'seasonal-flows-in-palikir-crater', '15 May 2013'),
      { label: 'HiRISE ESP_021555_1380 — Slope Features on Wall of Palikir Crater', url: 'https://www.uahirise.org/ESP_021555_1380' },
    ],
  },
  {
    id: 'rsl-horowitz',
    name: 'Horowitz Crater',
    lat: -32.042,
    lonE: 140.802,
    observation: hirise('PSP_005787_1475', '21 October 2007'),
    description: 'Warm-season flows on a slope in Horowitz crater, shown by NASA in an eight-image HiRISE sequence released in August 2011.',
    sources: [
      pj('PIA14475', 'Warm-Season Flows on Slope in Horowitz Crater, Eight-Image Sequence', 'warm-season-flows-on-slope-in-horowitz-crater-eight-image-sequence', '4 Aug 2011'),
      { label: 'HiRISE PSP_005787_1475 (catalogue title: “Braided Channels in Central Uplift of Unnamed Crater”)', url: 'https://www.uahirise.org/PSP_005787_1475' },
    ],
  },
  {
    id: 'rsl-tivat',
    name: 'Tivat Crater',
    lat: -45.943,
    lonE: 9.534,
    observation: hirise('ESP_023184_1335', '8 July 2011'),
    description:
      'RSL on the inner southern rim. A 2017 study found these flows end at about the same slope as the angle of repose for sand, so they are likely moving granular material.',
    sources: [
      pj('PIA22070', 'Seasonal Dark Streaks in Tivat Crater, Mars', 'seasonal-dark-streaks-in-tivat-crater-mars', '20 Nov 2017'),
      pj('PIA22114', 'Transient Slope Lineae Formation in a Well-Preserved Crater', 'transient-slope-lineae-formation-in-a-well-preserved-crater', '20 Nov 2017'),
      { label: 'HiRISE ESP_023184_1335', url: 'https://www.uahirise.org/ESP_023184_1335' },
    ],
  },
  {
    id: 'rsl-asimov',
    name: 'Asimov Crater (central pit)',
    lat: -46.84,
    lonE: 5.144,
    observation: hirise('ESP_040485_1330', '17 March 2015'),
    description:
      'Seasonal flows on the slopes of the central pit that grow in summer, fade, and re-form the next year; new RSL formed here after the 2018 global dust storm.',
    sources: [
      pj('PIA18561', 'Seasonal Flows in Asimov Crater', 'seasonal-flows-in-asimov-crater', '20 May 2015'),
      pj('PIA22898', 'The Eastern Slope of Asimov Crater’s Central Pit', 'the-eastern-slope-of-asimov-craters-central-pit', '11 Dec 2018'),
      { label: 'HiRISE ESP_040485_1330 — Seasonal Flows in Asimov Crater', url: 'https://www.uahirise.org/ESP_040485_1330' },
    ],
  },
  {
    id: 'rsl-raga',
    name: 'Raga Crater',
    lat: -48.113,
    lonE: 242.433,
    observation: hirise('ESP_040028_1315', '9 February 2015'),
    description: 'A small crater that NASA calls “the location of well-studied recurring slope lineae”, which disappear and re-form every Mars year.',
    sources: [
      pj('PIA19309', 'Recurring Slope Lineae in Raga Crater', 'recurring-slope-lineae-in-raga-crater', '11 Mar 2015'),
      { label: 'HiRISE ESP_040028_1315 — Recurring Slope Lineae in Raga Crater', url: 'https://www.uahirise.org/ESP_040028_1315' },
    ],
  },
  {
    id: 'rsl-garni',
    name: 'Garni Crater (Valles Marineris)',
    lat: -11.517,
    lonE: 290.317,
    observation: hirise('ESP_031059_1685', '12 March 2013'),
    description: 'Dark streaks up to a few hundred metres long on the walls of Garni crater, on the floor of central Valles Marineris.',
    sources: [
      pj('PIA19917', 'Dark, Recurring Streaks on Walls of Garni Crater', 'dark-recurring-streaks-on-walls-of-garni-crater', '28 Sep 2015'),
      { label: 'HiRISE ESP_031059_1685', url: 'https://www.uahirise.org/ESP_031059_1685' },
    ],
  },
  {
    id: 'rsl-coprates',
    name: 'Coprates Chasma (Valles Marineris)',
    lat: -12.93,
    lonE: 295.417,
    observation: hirise('ESP_034830_1670', '31 December 2013'),
    description: 'Dark flows that are abundant along the steep slopes of ancient bedrock in Coprates Chasma.',
    sources: [
      pj('PIA18119', 'Recurring Slope Lineae in Coprates Chasma', 'recurring-slope-lineae-in-coprates-chasma', '9 Apr 2014'),
      { label: 'HiRISE ESP_034830_1670 — Recurring Slope Lineae in Coprates Chasma', url: 'https://www.uahirise.org/ESP_034830_1670' },
    ],
  },
  {
    id: 'rsl-juventae',
    name: 'Juventae Chasma',
    lat: -4.692,
    lonE: 298.578,
    observation: hirise('ESP_030373_1755', '18 January 2013'),
    description: 'RSL in Juventae Chasma, a box canyon that is part of the Valles Marineris system.',
    sources: [
      pj('PIA19118', 'Recurring Slope Lineae in Juventae Chasma', 'recurring-slope-lineae-in-juventae-chasma', '10 Dec 2014'),
      { label: 'HiRISE ESP_030373_1755 — Recurring Slope Lineae in Juventae Chasma', url: 'https://www.uahirise.org/ESP_030373_1755' },
    ],
  },
  {
    id: 'rsl-krupac',
    name: 'Krupac Crater',
    lat: -7.792,
    lonE: 86.044,
    observation: hirise('ESP_049488_1720', '15 February 2017'),
    description: 'A young crater near the equator that NASA says hosts “some of the most impressive recurring slope lineae (RSL) on equatorial Mars outside of Valles Marineris”.',
    sources: [
      pj('PIA21605', 'Colorful Equatorial Gullies in Krupac Crater', 'colorful-equatorial-gullies-in-krupac-crater', '2 May 2017'),
      { label: 'HiRISE ESP_049488_1720 — Colorful Equatorial Gullies in Krupac Crater', url: 'https://www.uahirise.org/ESP_049488_1720' },
    ],
  },
];

/** Context only (not plotted as observation markers): NASA's own map of many RSL sites in Valles Marineris. */
export const RSL_CONTEXT_LINKS: RslSource[] = [
  pj('PIA20756', 'Sites with Seasonal Streaks on Slopes in Mars Canyons (map of RSL sites in Valles Marineris)', 'sites-with-seasonal-streaks-on-slopes-in-mars-canyons', '7 Jul 2016'),
  pj('PIA22070', 'Seasonal Dark Streaks in Tivat Crater (“many thousands of them at more than 50 sites”)', 'seasonal-dark-streaks-in-tivat-crater-mars', '20 Nov 2017'),
];

/** How precise the markers are, shown with the map. */
export const RSL_PRECISION_NOTE =
  'Each marker is the centre of one HiRISE image in which NASA reports RSL (images are about 5–6 km wide), so it is accurate to a few kilometres, not the position of each streak.';

/** −180…+180 longitude for the globe and 2D map. */
export const rslLon = (site: RslSite) => (site.lonE > 180 ? site.lonE - 360 : site.lonE);

/** "35.68° S, 323.48° E" */
export function formatRslCoords(site: RslSite): string {
  return `${Math.abs(site.lat).toFixed(2)}° ${site.lat < 0 ? 'S' : 'N'}, ${site.lonE.toFixed(2)}° E`;
}

/** The marker position as a labelled, sourced value (rule 3). */
export function rslCoordinateValue(site: RslSite): MeasuredValue {
  const source: SourceRef = {
    name: `HiRISE catalogue page for ${site.observation.id} (image centre)`,
    url: site.observation.url,
    sourceDate: `Image taken ${site.observation.date}`,
    accessed: ACCESSED,
  };
  return { id: `${site.id}-coords`, label: 'Image centre', value: formatRslCoords(site), status: 'measured', source };
}
