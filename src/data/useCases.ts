import type { SourceRef } from './types';

/**
 * "Use cases": what NASA has actually used these places for, with sources.
 * These are documented uses, NOT rankings or scores by us.
 * Accessed 14–15 November 2026 (see docs/SOURCES.md).
 */

export interface UseCaseEntry {
  siteId: string;
  /** What NASA used or chose the place for, quoted or closely paraphrased. */
  text: string;
  source: SourceRef;
}

export interface UseCaseGroup {
  id: string;
  title: string;
  intro: string;
  entries: UseCaseEntry[];
}

const ACCESSED = '15 November 2026';
const img = (nasaId: string, title: string): SourceRef => ({
  name: `NASA Image and Video Library — ${nasaId}: ${title}`,
  url: `https://images.nasa.gov/details/${nasaId}`,
  sourceDate: 'Date shown on the record',
  accessed: ACCESSED,
});
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
const NSSDCA_PHOENIX: SourceRef = {
  name: 'NASA NSSDCA — Phoenix Mars Lander spacecraft record',
  url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A',
  sourceDate: 'Page date not stated',
  accessed: ACCESSED,
};

export const USE_CASES: UseCaseGroup[] = [
  {
    id: 'landed',
    title: 'Where NASA chose to land on Mars, and why',
    intro: 'Real landing sites and the reasons NASA gives for them.',
    entries: [
      {
        siteId: 'jezero',
        text: 'Landing site for NASA’s Mars 2020 mission (Perseverance). NASA: “On ancient Mars, water carved channels and transported sediments to form fans and deltas within lake basins.”',
        source: img('PIA23239', "Jezero Crater, Mars 2020's Landing Site"),
      },
      {
        siteId: 'gale',
        text: 'Curiosity “will land in August 2012 near the foot of a mountain inside Gale Crater”, which the science team calls Mount Sharp.',
        source: img('PIA15292', 'Mount Sharp Inside Gale Crater, Mars'),
      },
      {
        siteId: 'phoenix',
        text: 'Phoenix was designed to study the surface and near-surface environment of a landing site in the high northern area of Mars; it landed in “a relatively boulder-free area with a high (30-60%) ratio of ice to rock.”',
        source: NSSDCA_PHOENIX,
      },
      {
        siteId: 'utopia',
        text: 'The second Viking landing (Viking 2) took place on 3 September 1976 in Utopia Planitia.',
        source: img('PIA04023', 'Viking Lander 2 Anniversary'),
      },
    ],
  },
  {
    id: 'rover-tests',
    title: 'Testing rovers and landing systems on Earth',
    intro: 'Earth places NASA used to rehearse robotic missions.',
    entries: [
      {
        siteId: 'death-valley',
        text: 'NASA’s Mars 2020 team practised hazard avoidance here before sending Perseverance and Ingenuity to Mars; a helicopter test flight carried an engineering model of the Lander Vision System.',
        source: img('PIA23265', "NASA's Mars 2020 Mission Drops in on Death Valley"),
      },
      {
        siteId: 'haughton',
        text: 'NASA’s K-10 Red rover was driven near ‘The Fortress’ formation at Haughton crater (2007).',
        source: img('ARC-2007-ACD09-0255-001', 'K-10 Red at Haughton Crater'),
      },
    ],
  },
  {
    id: 'astronauts',
    title: 'Training astronauts and mission teams',
    intro: 'Places where people practise exploring other worlds.',
    entries: [
      {
        siteId: 'haughton',
        text: 'The Haughton-Mars Project is a mission analog; Mars is covered in craters, so Haughton crater is a good place to practise Martian extravehicular activities (EVAs).',
        source: TEN_THINGS,
      },
      {
        siteId: 'holuhraun',
        text: 'Artemis II crew geology training: NASA notes Iceland has been used as a planetary analog for geology training for astronauts.',
        source: img('jsc2024e055198', 'Artemis II Crew geology training in Iceland'),
      },
    ],
  },
  {
    id: 'life',
    title: 'Searching for signs of life',
    intro: 'Astrobiology analogs that help rovers know what to look for.',
    entries: [
      { siteId: 'lake-salda', text: 'Sediments at Lake Salda’s edge hold clues about the history of Jezero Crater, an ancient Martian lakebed.', source: ANALOG_EXPLORER },
      { siteId: 'atacama', text: 'One of the driest places on Earth; helps scientists understand how the building blocks of life might respond to Martian conditions over time.', source: ANALOG_EXPLORER },
      { siteId: 'verde-valley', text: 'Scientists learn how biosignatures are preserved, helping Curiosity know what to look for on Mars.', source: ANALOG_EXPLORER },
      { siteId: 'pilot-valley', text: 'Perchlorate salts here, also seen in many places on Mars, are used by tiny life forms on Earth as an energy source.', source: ANALOG_EXPLORER },
    ],
  },
  {
    id: 'geology',
    title: 'Understanding geology',
    intro: 'Landforms on Earth that help explain similar ones on Mars.',
    entries: [
      { siteId: 'holuhraun', text: 'NASA scientists studied this flood-basalt eruption because “this volcano has geologic cousins on Mars.”', source: ANALOG_EXPLORER },
      { siteId: 'death-valley', text: '“Utopia Planitia, as seen by Viking 2, looks a lot like Death Valley National Park.”', source: ANALOG_EXPLORER },
    ],
  },
];
