import type { AnaloguePair } from './types';

/**
 * Earth ⇄ Mars analogue pairs. Every similarity and difference below is taken
 * from (or closely paraphrases) the cited NASA text, accessed 15 November 2026.
 * NASA calls these "analogs": places with things in common, NOT equivalents.
 * World-level differences (gravity, atmosphere, radiation) are always shown
 * separately by the Compare view.
 */




export const ANALOGUE_PAIRS: AnaloguePair[] = [
  {
    // Chosen by our team (not a NASA-documented pair); reasons and sources in src/data/lappajarviResearch.ts.
    id: 'lappajarvi-jezero',
    earthSiteId: 'lake-lappajarvi',
    marsSiteId: 'jezero',
    title: 'Impact craters and hydrothermal history (team analogue)',
    similarities: [
      'Both are meteorite impact craters with impact-formed rocks.',
      'Lappajärvi preserves evidence that an impact-made hydrothermal system was later colonized by microbes; scientists ask whether Martian impact craters could have hosted similar systems.',
    ],
    differences: ['Lappajärvi holds a lake on Earth today; Jezero is an ancient Martian crater that once held a lake and a river delta.'],
    source: { name: 'Crater Lake Lappajärvi Geopark — Birth of the crater lake', url: 'https://kraatterijarvigeopark.fi/birth-of-the-crater-lake', sourceDate: 'Page date not stated', accessed: '16 November 2026' },
    documentedBy: 'team',
  },
  {
    // Chosen by our team (not a NASA-documented pair). The reasons and their sources are in
    // Badwater Basin's Compare column (src/data/badwaterResearch.ts).
    id: 'badwater-gale',
    earthSiteId: 'badwater-basin',
    marsSiteId: 'gale',
    title: 'Salt minerals, wind and an ancient lake (team analogue)',
    similarities: [
      'Badwater’s salt minerals form today as groundwater evaporates; in Gale, Curiosity found salty minerals that groundwater left behind billions of years ago.',
      'Both are low basins ringed by high ground (mountain ranges; Gale’s crater rim and Mount Sharp), where wind and dust erode the rock.',
      'Badwater Basin was the site of the ancient Lake Manly; Gale held long-lived lakes billions of years ago.',
    ],
    differences: ['Badwater’s salts and life are active today; Gale’s lakes dried up billions of years ago.'],
    source: {
      name: 'NPS — Badwater Basin',
      url: 'https://www.nps.gov/places/badwater-basin.htm',
      sourceDate: 'Last updated 7 January 2026',
      accessed: '16 November 2026',
    },
    documentedBy: 'team',
  },
  {
    // Chosen by our team (not a NASA-documented pair); reasons and sources in src/data/mcmurdoResearch.ts.
    id: 'mcmurdo-hale',
    earthSiteId: 'mcmurdo-dry-valleys',
    marsSiteId: 'hale',
    title: 'Dark slope streaks and salty soils (team analogue)',
    similarities: [
      'Dark streaks on rocky slopes: wet water tracks near Don Juan Pond; RSL on Hale’s central peaks.',
      'Calcium chloride salts in the South Fork soils absorb moisture from the air; brine is one debated explanation for RSL.',
    ],
    differences: ['The Antarctic streaks are wet with liquid water; whether RSL involve any water is debated.'],
    source: {
      name: 'NASA — Dry Valleys, Antarctica',
      url: 'https://www.nasa.gov/image-article/dry-valleys-antarctica/',
      sourceDate: '4 December 2009',
      accessed: '16 November 2026',
    },
    documentedBy: 'team',
  },
  {
    // Chosen by our team (not a NASA-documented pair). Linked ONLY to Elysium Planitia.
    // Research is pending (docs/holuhraun-research.md); no similarities are claimed yet.
    id: 'holuhraun-elysium',
    earthSiteId: 'holuhraun',
    marsSiteId: 'elysium-planitia',
    title: 'Basaltic lava flows (team analogue, research pending)',
    similarities: [],
    differences: [],
    source: {
      name: 'NASA Earth Observatory — Roiling Flows on Holuhraun Lava Field',
      url: 'https://science.nasa.gov/earth/earth-observatory/roiling-flows-on-holuhraun-lava-field-84316/',
      sourceDate: '10 September 2014',
      accessed: '16 November 2026',
    },
    documentedBy: 'team',
  },
];

/** All pairs that involve a featured site (on either world). */
export function pairsForSite(siteId: string): AnaloguePair[] {
  return ANALOGUE_PAIRS.filter((p) => p.earthSiteId === siteId || p.marsSiteId === siteId);
}
