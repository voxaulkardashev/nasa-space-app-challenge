import type { AnaloguePair, SourceRef } from './types';

/**
 * Earth ⇄ Mars analogue pairs. Every similarity and difference below is taken
 * from (or closely paraphrases) the cited NASA text, accessed 15 November 2026.
 * NASA calls these "analogs": places with things in common, NOT equivalents.
 * World-level differences (gravity, atmosphere, radiation) are always shown
 * separately by the Compare view.
 */

const ACCESSED = '15 November 2026';

const ANALOG_EXPLORER: SourceRef = {
  name: 'NASA Science — Planetary Analog Explorer',
  url: 'https://science.nasa.gov/solar-system/analog-explorer/',
  sourceDate: 'Page date not stated',
  accessed: ACCESSED,
};

const TEN_THINGS: SourceRef = {
  name: 'NASA Science — 10 Things to Know About Planetary Analogs',
  url: 'https://science.nasa.gov/solar-system/planetary-analogs/10-things-to-know-about-planetary-analogs/',
  sourceDate: 'Page date not stated',
  accessed: ACCESSED,
};

export const ANALOGUE_PAIRS: AnaloguePair[] = [
  {
    id: 'salda-jezero',
    earthSiteId: 'lake-salda',
    marsSiteId: 'jezero',
    title: 'Looking for Life: Turkey and Mars',
    similarities: [
      'NASA: Jezero Crater “has geological and mineral characteristics in common with Lake Salda.”',
      'Light-coloured sediments at Lake Salda’s edge may have formed with the help of tiny living things; Perseverance is searching Jezero for similar signs of ancient life.',
      'NASA photo caption (PIA24375): the eastern shore of Lake Salda “is a good analog for what an ancient lake may have looked like at Jezero [Crater]”; its white sands and rocks are carbonate minerals that precipitated in the lake.',
    ],
    differences: [
      'Lake Salda holds water today; Jezero is an ancient Martian lakebed (evidence of former river flow along its rim).',
      'Scale: Lake Salda is similar in size to Perseverance’s landing ellipse (7.7 km × 6.6 km); Jezero crater is 47.52 km across (IAU).',
    ],
    source: ANALOG_EXPLORER,
  },
  {
    id: 'atacama-jezero',
    earthSiteId: 'atacama',
    marsSiteId: 'jezero',
    title: 'Looking for Life: the Atacama Desert and Mars',
    similarities: [
      'One of the driest places on Earth; it helps scientists understand how the building blocks of life might respond to Martian conditions over time.',
      'Portable instruments detect very small amounts of target molecules in the soil, as Perseverance’s own instruments search for biosignatures on Mars.',
    ],
    differences: [],
    source: ANALOG_EXPLORER,
  },
  {
    id: 'verde-gale',
    earthSiteId: 'verde-valley',
    marsSiteId: 'gale',
    title: 'Looking for Life: Arizona and Mars',
    similarities: [
      'Scientists study how signs of life (biosignatures) are preserved in Verde Valley; this helps Curiosity, at the base of Mount Sharp in Gale crater, know what to look for.',
    ],
    differences: [],
    source: ANALOG_EXPLORER,
  },
  {
    id: 'deathvalley-utopia',
    earthSiteId: 'death-valley',
    marsSiteId: 'utopia',
    title: 'Rocky Reconnaissance: California and Mars',
    similarities: [
      'NASA: “Utopia Planitia, as seen by Viking 2, looks a lot like Death Valley National Park.”',
      'NASA’s Mars 2020 team practised hazard avoidance in Death Valley before sending Perseverance and Ingenuity to Mars.',
    ],
    differences: [],
    source: ANALOG_EXPLORER,
  },
  {
    id: 'pilot-phoenix',
    earthSiteId: 'pilot-valley',
    marsSiteId: 'phoenix',
    title: 'Looking for Life: Utah and Mars',
    similarities: [
      'Perchlorate, a salt found in Pilot Valley, “has been observed in many places on Mars”; NASA’s example is the northern plains where Phoenix landed.',
    ],
    differences: [
      'On Earth, tiny life forms use perchlorate as an energy source. No life has been found on Mars: NASA says knowledge of these salts may help recognise microbial life “if it exists beyond our planet, or if it ever did.”',
    ],
    source: ANALOG_EXPLORER,
  },
  {
    id: 'haughton-mars',
    earthSiteId: 'haughton',
    marsSiteId: null,
    title: 'Haughton-Mars Project (mission analog)',
    similarities: [
      'The island’s barren terrain, freezing temperatures, isolation and remoteness mimic conditions on Mars (NASA).',
      'Mars is covered in craters, so Haughton crater is a good place to practise Martian extravehicular activities (NASA).',
    ],
    differences: [],
    source: TEN_THINGS,
  },
  {
    id: 'holuhraun-mars',
    earthSiteId: 'holuhraun',
    marsSiteId: null,
    title: 'Flood Basalts on Mars & in Iceland',
    similarities: ['NASA: “This volcano has geologic cousins on Mars.”'],
    differences: [],
    source: ANALOG_EXPLORER,
  },
];

/** All pairs that involve a featured site (on either world). */
export function pairsForSite(siteId: string): AnaloguePair[] {
  return ANALOGUE_PAIRS.filter((p) => p.earthSiteId === siteId || p.marsSiteId === siteId);
}
