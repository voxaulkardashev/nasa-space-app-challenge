import type { SiteResearch } from './siteResearch';

/**
 * TEMPORARY. The Earth side of the Elysium Planitia comparison until the team picks an analog.
 * To replace it: change the 'earth-placeholder' site in featuredSites.ts, the 'elysium-placeholder'
 * pair in analogues.ts, and this file. Nothing here is research.
 */

export const PLACEHOLDER_MESSAGE =
  'An Earth analog for Elysium Planitia has not been selected yet. This location and map marker are temporary and will be replaced.';

export const EARTH_PLACEHOLDER_RESEARCH: SiteResearch = {
  siteId: 'earth-placeholder',
  citations: [],
  sections: [
    {
      id: 'placeholder',
      title: 'Placeholder',
      paragraphs: [PLACEHOLDER_MESSAGE, 'The marker sits at an arbitrary point on land. It is not an analog, and no similarities are claimed.'],
      facts: [
        {
          id: 'placeholder-coords',
          label: 'Temporary marker',
          value: '46.00° N, 2.00° E',
          status: 'placeholder',
          reason: 'Arbitrary location used only to test the map and comparison layout.',
        },
      ],
    },
  ],
};
