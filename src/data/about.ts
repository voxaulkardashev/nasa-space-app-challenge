import type { InfoSection } from './types';

/** "About the project" pop-up on the landing page (text written by the team). */
export const ABOUT_SECTIONS: InfoSection[] = [
  {
    id: 'significance',
    title: 'Geological Significance',
    body: 'Earth’s diverse field environments give us a window into the mechanisms and processes of similar far-off Martian landscapes that we cannot yet study with our own eyes. Understanding and discovering new planetary analog sites is critical for the future of space exploration.',
  },
  {
    id: 'analog-sites',
    title: 'Geological Analog Sites',
    body: 'Impact structures, sediments, mineralogy, terrain, glacier landscapes, past water structures, & evidence of Aeolian processes.',
  },
  {
    id: 'applications',
    title: 'Scientific & Exploratory Applications',
    body: 'Understanding erosion, sediment transportation, mineral formation, Martian glacial landscapes, and locating freshwater sources for astronauts.',
  },
];
