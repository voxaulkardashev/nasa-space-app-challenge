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

/**
 * Shown on the landing page and in "About the project". The app's name is close to
 * NASA's own "Planetary Analog Explorer", so this makes clear it is not a NASA product
 * (NASA and JPL image policies forbid implying endorsement).
 */
export const PROJECT_DISCLAIMER =
  'Planetary Analogue Explorer is a student project made for the NASA Space Apps Challenge. It is not affiliated with, sponsored by or endorsed by NASA, JPL or Caltech. NASA images and data are used with the credit line shown next to each one, following NASA’s and JPL’s image use guidelines; images owned by NASA’s partners (named in their credits) are used for educational purposes only.';

export const PROJECT_DISCLAIMER_SHORT = 'Student project for the NASA Space Apps Challenge · Not affiliated with or endorsed by NASA';
