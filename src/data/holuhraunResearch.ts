import type { ResearchSection, SiteResearch } from './siteResearch';

/**
 * Holuhraun, Iceland: the Earth side of the Elysium Planitia comparison.
 * The team's research will be added later (their draft is kept in docs/holuhraun-research.md),
 * so each section is an empty, clearly marked placeholder for now. Only the weather card
 * (existing NASA POWER feature) and one NASA image with its credit are filled in.
 */

const PENDING = 'Research for this section will be added later.';

const pending = (id: string, title: string, extra: Partial<ResearchSection> = {}): ResearchSection => ({
  id,
  title,
  paragraphs: [PENDING],
  ...extra,
});

export const HOLUHRAUN_RESEARCH: SiteResearch = {
  siteId: 'holuhraun',
  citations: [{ n: 1, title: 'NASA POWER — Hourly API', url: 'https://power.larc.nasa.gov/docs/services/api/temporal/hourly/' }],
  sections: [
    pending('minerals', 'Mineral Composition'),
    pending('terrain', 'Terrain and Landforms', {
      figure: {
        src: 'images/holuhraun/holuhraun-landsat8-2014.jpg',
        alt: 'False-colour Landsat 8 image of the Holuhraun eruption: a bright orange lava flow and a pale blue plume between Askja volcano and the Vatnajökull ice cap.',
        caption:
          'The Holuhraun eruption on 6 September 2014, seen by the Operational Land Imager on Landsat 8 (false colour, OLI bands 6-5-3: ice and the gas plume appear cyan and blue, liquid water navy blue).',
        credit: 'NASA Earth Observatory image by Jesse Allen, using Landsat data from the U.S. Geological Survey',
        sourceUrl: 'https://science.nasa.gov/earth/earth-observatory/roiling-flows-on-holuhraun-lava-field-84316/',
        sourceLabel: 'NASA Earth Observatory — Roiling Flows on Holuhraun Lava Field (10 Sep 2014)',
        width: 720,
        height: 480,
      },
    }),
    pending('soil', 'Soil Properties'),
    pending('life', 'Signs of Past Life'),
    {
      id: 'weather',
      title: 'Temperature/Weather',
      paragraphs: ['Below are the newest weather values for Holuhraun from NASA POWER, the same NASA service the website uses for other Earth sites. They load each time you open this view. [[1]]'],
      liveEarth: { lat: 64.874, lon: -16.74, place: 'Holuhraun, Iceland', timeZone: 'Atlantic/Reykjavik' },
    },
    pending('elevation', 'Elevation'),
  ],
};
