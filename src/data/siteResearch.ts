import { BADWATER_RESEARCH } from './badwaterResearch';
import { HALE_RESEARCH } from './haleResearch';
import { MCMURDO_RESEARCH } from './mcmurdoResearch';
import { ELYSIUM_RESEARCH } from './elysiumResearch';
import { LAPPAJARVI_RESEARCH } from './lappajarviResearch';
import { EARTH_PLACEHOLDER_RESEARCH } from './placeholderResearch';
import { JEZERO_RESEARCH } from './jezeroResearch';
import type { DataValue } from './types';

/**
 * Team research shown in the Compare view's site columns (Gale, Jezero and Hale on Mars; Badwater Basin and the McMurdo Dry Valleys on Earth).
 * Text is the team's research, lightly edited for clarity and checked against
 * each cited page (see docs/SOURCES.md). In paragraphs, "[[n]]" marks citation n.
 */

export interface ResearchCitation {
  n: number;
  /** Short title of the source page. */
  title: string;
  url: string;
}

export interface ResearchFigure {
  /** Path inside public/. */
  src: string;
  alt: string;
  caption: string;
  /** Credit exactly as given on the source page. */
  credit: string;
  /** Where the image comes from (opens in a new tab). */
  sourceUrl: string;
  sourceLabel: string;
  /** Width / height of the image, so it keeps its proportions while loading. */
  width: number;
  height: number;
}

export interface ResearchSection {
  id: string;
  title: string;
  paragraphs: string[];
  figure?: ResearchFigure;
  /** Labelled values (Measured / Estimated) shown under the text. */
  facts?: DataValue[];
  /** Live conditions at this spot, read from NASA's PSG Mars Explorer when the section is shown. */
  live?: { lat: number; lon: number; place: string };
  /** Small print under the section (caveats). */
  notes?: string[];
  /** Titled parts of the section, e.g. competing hypotheses (`tag` shows a badge such as "Debated"). */
  subsections?: { title: string; tag?: string; paragraphs: string[] }[];
  /** Earth sites: the newest NASA POWER weather at this spot (the weather assistant's Earth service), loaded when shown. */
  liveEarth?: { lat: number; lon: number; place: string; timeZone: string; liveLink?: { label: string; url: string }; gridNote?: string };
  /** Historical (not current) weather from a past mission: 'insight' = InSight Weather API, sols 675–681. */
  historicalWeather?: 'insight';
  /** An interactive map shown in this section ('rsl-sites': where RSL have been observed on Mars). */
  map?: 'rsl-sites';
}

export interface SiteResearch {
  siteId: string;
  sections: ResearchSection[];
  citations: ResearchCitation[];
  /** Extra credits listed at the bottom of the column, exactly as the team gave them. */
  otherCredits?: { title: string; url: string }[];
}

const ACCESSED = '15 November 2026';

const CITATIONS: ResearchCitation[] = [
  { n: 1, title: 'NASA Science — Mineral Content Comparison at Two Gale Crater Sites (13 Dec 2016)', url: 'https://science.nasa.gov/resource/mineral-content-comparison-at-two-gale-crater-sites/' },
  { n: 2, title: 'NASA Science — A Guide to Gale Crater (2 Aug 2017)', url: 'https://science.nasa.gov/resource/a-guide-to-gale-crater/' },
  { n: 3, title: 'Smithsonian National Air and Space Museum — 10 Years of Curiosity on Mars', url: 'https://airandspace.si.edu/stories/editorial/10-years-curiosity-mars' },
  { n: 4, title: 'NASA Science — Gale Crater’s Surface Materials (19 Jun 2015)', url: 'https://science.nasa.gov/resource/gale-craters-surface-materials/' },
  { n: 5, title: 'International Journal of Astrobiology, vol. 12, p. 25 (2013) — Astrophysics Data System record 2013IJAsB..12...25W', url: 'https://ui.adsabs.harvard.edu/abs/2013IJAsB..12...25W/abstract' },
  { n: 6, title: 'NASA JPL — Topography of Gale Crater, PIA15093 (21 Nov 2011)', url: 'https://www.jpl.nasa.gov/images/pia15093-topography-of-gale-crater/' },
  { n: 7, title: 'NASA Goddard Planetary Spectrum Generator — Mars Explorer app', url: 'https://psg.gsfc.nasa.gov/apps/mars/' },
];


const GALE: SiteResearch = {
  siteId: 'gale',
  citations: CITATIONS,
  sections: [
    {
      id: 'minerals',
      title: 'Mineral Composition',
      paragraphs: [
        'The image compares the minerals in mudstone at two different areas of Gale Crater: Yellowknife Bay on the crater floor and Murray Buttes on lower Mount Sharp. The rover drilled into the rocks and delivered the powdered samples to its Chemistry and Mineralogy (CheMin) instrument, which identified the minerals using X-ray diffraction. [[1]]',
        'The image shows that Gale Crater contains a variety of minerals and mineral groups, including magnetite, mafics, calcium sulfates, clay minerals and plagioclase feldspar. Murray Buttes has hematite (a more oxidised iron mineral) instead of magnetite, and far fewer crystalline mafic minerals, which could mean that layer was more weathered. [[1]]',
      ],
      figure: {
        src: 'images/gale/mineral-comparison-pia21149.jpg',
        alt: 'Bar chart comparing mudstone minerals at Yellowknife Bay and Murray Buttes: X-ray amorphous material, magnetite or hematite, crystalline mafics, calcium sulfates, clay minerals and plagioclase feldspar.',
        caption: 'Comparative lakebed mudstone mineralogy: Yellowknife Bay (2013) and Murray Buttes (2016), measured by Curiosity’s CheMin instrument.',
        credit: 'NASA/JPL-Caltech',
        sourceUrl: 'https://science.nasa.gov/resource/mineral-content-comparison-at-two-gale-crater-sites/',
        sourceLabel: 'Mineral Content Comparison at Two Gale Crater Sites (PIA21149)',
        width: 570,
        height: 538,
      },
    },
    {
      id: 'terrain',
      title: 'Terrain and Landforms',
      paragraphs: [
        'Gale Crater is a large impact basin [[2]] that is believed to have once held water, which leads scientists to think it once had a more hospitable environment. Its lake-deposited rocks, known as the Murray Formation, record a long period of wetter, potentially habitable conditions, and the layers above them show the environment changing as it became drier. Eventually the lake dried out and was filled in as the environment transitioned; these layered deposits now form the lower slopes of the mountain inside the crater, Mount Sharp. [[3]] [[1]]',
        'The crater has a diameter of 96 miles (154 kilometers). [[4]]',
      ],
      facts: [
        {
          id: 'gale-diameter',
          label: 'Crater diameter',
          value: '154 km (96 miles)',
          status: 'measured',
          source: { name: 'NASA Science — Gale Crater’s Surface Materials', url: 'https://science.nasa.gov/resource/gale-craters-surface-materials/', sourceDate: '19 June 2015', accessed: ACCESSED },
        },
      ],
      figure: {
        src: 'images/gale/gale-terrain-themis-pia14290.jpg',
        alt: 'Grayscale orbital mosaic of Gale Crater with its central mountain; an ellipse marks Curiosity’s planned landing area.',
        caption: 'Visible-light mosaic of Gale from the THEMIS camera on NASA’s Mars Odyssey orbiter. The ellipse marks the planned landing area (20 × 25 km).',
        credit: 'NASA/JPL-Caltech/ASU',
        sourceUrl: 'https://science.nasa.gov/resource/gale-crater-future-home-of-mars-rover-curiosity/',
        sourceLabel: 'Gale Crater: Future Home of Mars Rover Curiosity (PIA14290)',
        width: 1200,
        height: 927,
      },
    },
    {
      id: 'soil',
      title: 'Soil Properties',
      paragraphs: [
        'In this false-colour image, the bright pink areas on Gale Crater’s floor are caused by a mix of basaltic sand and windblown dust, while the blue areas near the summit of Mount Sharp probably come from local materials exposed there. Typical Martian surface soil looks grayish-green in this colour scheme. [[4]]',
      ],
      figure: {
        src: 'images/gale/gale-surface-materials-pia19674.jpg',
        alt: 'False-colour THEMIS mosaic of Gale Crater: pink crater floor, blue patches near the summit of Mount Sharp, grayish-green surroundings.',
        caption: 'False colours from THEMIS on Mars Odyssey show mineral differences in surface materials. North is up.',
        credit: 'NASA/JPL-Caltech/Arizona State University',
        sourceUrl:
          'https://assets.science.nasa.gov/content/dam/science/psd/mars/downloadable_items/3/8/38715_Mars-Odyssey-THEMIS-Gale-Crater-Minerals-pia19674.jpg',
        sourceLabel: 'Gale Crater’s Surface Materials (PIA19674, original image)',
        width: 900,
        height: 1125,
      },
    },
    {
      id: 'past-life',
      title: 'Signs of Past Life',
      paragraphs: [
        'A large meteor impact formed Gale Crater, cracking the rock below and creating a central peak as the surface rebounded. Water then flowed into the crater, forming a large lake and depositing gravel, sand and silt. [[2]]',
        'Over millions of years, these sediments built up in layers, each recording a snapshot of the environment at the time. As Mars dried, the rivers disappeared, and windblown sand and dust buried the deposits. [[2]]',
        'Later, wind erosion exposed some of these ancient layers, allowing groundwater to flow through and alter the rocks. By about 3 billion years ago, Gale Crater had developed its basic shape. [[2]]',
        'Evidence studied by Curiosity suggests that the crater once contained a long-lasting lake and groundwater, with occasional dry periods. [[2]] [[5]] NASA describes this water as friendly for potential microbes: these are signs of conditions that could have supported life, not evidence that life existed. [[2]]',
      ],
    },
    {
      id: 'weather',
      title: 'Temperature/Weather',
      paragraphs: [
        'Current conditions at Gale Crater, loaded from NASA Goddard’s Planetary Spectrum Generator (PSG) Mars Explorer each time you open this view, for 5.37° S, 137.81° E and the current time. No spacecraft reports live weather for Gale, so these are model estimates: PSG uses EMARS data from the past Mars year most similar to now (it reports Mars Year 32, 2013–2015) at today’s season and time of day. [[7]]',
      ],
      live: { lat: -5.37, lon: 137.81, place: 'Gale Crater (5.37° S, 137.81° E)' },
      notes: [
        'Limitations: model values for a large area around Gale (the model gives this point an altitude of 182 m), so they smooth out the deep crater and Mount Sharp, and can differ from what Curiosity measures on the ground. The app says it is “undergoing active development” and “should be only used for testing purposes”.',
      ],
    },
    {
      id: 'elevation',
      title: 'Elevation',
      paragraphs: [
        'This map shows the topography of Gale Crater; the colours show differences in elevation. The vertical difference between a low point inside Curiosity’s landing ellipse (yellow dot) and a high point on the mountain (red dot) is about 3 miles (5 kilometers). [[6]]',
      ],
      facts: [
        {
          id: 'gale-relief',
          label: 'Landing area to mountain high point',
          value: 'about 5 km (3 miles)',
          status: 'measured',
          source: { name: 'NASA JPL — Topography of Gale Crater (PIA15093)', url: 'https://www.jpl.nasa.gov/images/pia15093-topography-of-gale-crater/', sourceDate: '21 November 2011', accessed: ACCESSED },
        },
      ],
      figure: {
        src: 'images/gale/gale-topography-pia15093.jpg',
        alt: 'Colour-coded topographic map of Gale Crater with a yellow dot inside the landing ellipse and a red dot on the central mountain.',
        caption: 'Colour coding shows elevation. Yellow dot: low point inside the landing ellipse. Red dot: high point on the mountain.',
        credit: 'NASA/JPL-Caltech',
        sourceUrl: 'https://www.jpl.nasa.gov/images/pia15093-topography-of-gale-crater/',
        sourceLabel: 'Topography of Gale Crater (PIA15093)',
        width: 788,
        height: 720,
      },
    },
  ],
};

/** Research shown in place of the standard site column, by featured-site id. */
export const SITE_RESEARCH: Record<string, SiteResearch> = { gale: GALE, jezero: JEZERO_RESEARCH, hale: HALE_RESEARCH, 'badwater-basin': BADWATER_RESEARCH, 'mcmurdo-dry-valleys': MCMURDO_RESEARCH,
  'elysium-planitia': ELYSIUM_RESEARCH,
  'earth-placeholder': EARTH_PLACEHOLDER_RESEARCH,
  'lake-lappajarvi': LAPPAJARVI_RESEARCH,
};
