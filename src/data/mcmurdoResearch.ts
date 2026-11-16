import type { ResearchCitation, SiteResearch } from './siteResearch';

/**
 * McMurdo Dry Valleys (South Fork of Wright Valley, near Don Juan Pond): the team's research
 * for the Compare view's Earth column, shown next to Hale Crater / RSL. Text is the team's,
 * with grammar edits; statements no readable source supports are listed in docs/SOURCES.md.
 */

const CITATIONS: ResearchCitation[] = [
  { n: 1, title: 'NASA — Dry Valleys, Antarctica (image article, 4 Dec 2009)', url: 'https://www.nasa.gov/image-article/dry-valleys-antarctica/' },
  {
    n: 2,
    title:
      'Dickson, J. L., Head, J. W., Levy, J. S. & Marchant, D. R. (2013). Don Juan Pond, Antarctica: Near-surface CaCl2-brine feeding Earth’s most saline lake and implications for Mars. Scientific Reports 3, 1166. doi:10.1038/srep01166',
    url: 'https://doi.org/10.1038/srep01166',
  },
  {
    n: 3,
    title:
      'Levy, J. (2012). Hydrological characteristics of recurrent slope lineae on Mars: Evidence for liquid flow through regolith and comparisons with Antarctic terrestrial analogs. Icarus 219, 1–4. doi:10.1016/j.icarus.2012.02.016',
    url: 'https://doi.org/10.1016/j.icarus.2012.02.016',
  },
  { n: 4, title: 'NASA Photojournal PIA22070 — Seasonal Dark Streaks in Tivat Crater, Mars (20 Nov 2017)', url: 'https://science.nasa.gov/photojournal/seasonal-dark-streaks-in-tivat-crater-mars/' },
  { n: 5, title: 'NASA Photojournal PIA22994 — Hale Crater (THEMIS, 11 Jan 2019)', url: 'https://science.nasa.gov/photojournal/hale-crater-3/' },
  { n: 6, title: 'NASA Photojournal PIA17734 — Active Slope Flows on the Central Hills of Hale Crater (29 May 2013)', url: 'https://science.nasa.gov/photojournal/active-slope-flows-on-the-central-hills-of-hale-crater/' },
  { n: 7, title: 'NASA Photojournal PIA21608 — Seasonal Flows in Valles Marineris (4 May 2017)', url: 'https://science.nasa.gov/photojournal/seasonal-flows-in-valles-marineris/' },
  {
    n: 8,
    title: 'Polar Geospatial Center (University of Minnesota) — map “Don Juan Pond, Wright Valley” (location inset)',
    url: 'https://data.pgc.umn.edu/maps/antarctica/era/04/pdf/Don%20Juan%20Pond%20Wright%20Valley.pdf',
  },
];

export const MCMURDO_RESEARCH: SiteResearch = {
  siteId: 'mcmurdo-dry-valleys',
  citations: CITATIONS,
  sections: [
    {
      id: 'background-a',
      title: 'Background A',
      paragraphs: [
        'Even though liquid water is not considered stable on today’s Martian surface, observations from spacecraft have identified processes that could be associated with seasonal changes on Mars’ surface, such as dark streaks that appear in warm seasons and fade in cold ones. [[4]] These pose new questions about interactions between surface minerals, subsurface materials and even the Martian atmosphere.',
        'Fully understanding Martian processes is crucial for proceeding with confidence in identifying areas of interest and sending human explorers to Mars.',
      ],
    },
    {
      id: 'background-b',
      title: 'Background B: RSL on Mars',
      paragraphs: [
        'Recurring Slope Lineae (RSL) are mysterious, narrow, dark, elongated streaks observed on steep slopes across Mars; HiRISE has confirmed many thousands of them at more than 50 sites. [[4]] RSL themselves are a Martian phenomenon, so it is critical to find an accurate planetary analog for them if we want to fully understand seasonal mechanisms on Mars.',
      ],
    },
    {
      id: 'background-c',
      title: 'Background C: Hale Crater RSL',
      paragraphs: [
        'Hale Crater was formed by a large impact in the southern hemisphere of Mars. [[5]] It is an important research site for RSL because of its steep slopes, uplifted bedrock and dark slope features. [[6]]',
        'Studying Hale Crater alongside an Earth analog site will help scientists work out the mechanisms behind RSL and other similar seasonal Martian processes.',
      ],
    },
    {
      id: 'earth-analog',
      title: 'Earth Analog Site: McMurdo Dry Valleys',
      paragraphs: [
        'The McMurdo Dry Valleys, the Earth analog site for Hale Crater, are a row of valleys west of McMurdo Sound in Victoria Land, Antarctica. They are named for their extremely low humidity and lack of snow and ice cover, and scientists consider them the closest of any environment on Earth to Mars. [[1]]',
        'Their jagged rocky terrain, frozen lakes, limited seasonal water activity and very low precipitation make them an excellent comparison to Hale Crater on Mars.',
        'Specifically, the South Fork of Wright Valley, near Don Juan Pond [[8]], is very relevant to Martian RSL studies. Researchers have observed natural wet, dark streaks (“water tracks”) along the slopes of this area, and have compared them with RSL. [[2]] [[3]]',
        'These streaks are caused by seasonal snowmelt running through sediments on the surface, moving dissolved salts and altering the appearance of the surrounding soil. Salty soils here also draw moisture from the air, which helps feed the water tracks. [[2]]',
      ],
      facts: [
        {
          id: 'mcmurdo-coords',
          label: 'Don Juan Pond (South Fork of Wright Valley)',
          value: '77.563° S, 161.216° E',
          status: 'estimated',
          method:
            'Position printed on the Polar Geospatial Center map inset (77° 33.784′ S, 161° 12.948′ E), read from a web-search excerpt of the map because the PDF host is not reachable from our environment. It agrees with other published positions of the pond to within about 1 km. The team should confirm it against the map.',
        },
      ],
      figure: {
        src: 'images/mcmurdo/dry-valleys-aster-pia12461.jpg',
        alt: 'Satellite image of the McMurdo Dry Valleys: dark, snow-free valleys and rocky ridges between white glaciers and ice.',
        caption:
          'The McMurdo Dry Valleys from NASA’s Terra satellite (ASTER), acquired 8 December 2002. Snow-free valleys appear dark between glaciers. The small water tracks near Don Juan Pond are far too small to see at this scale.',
        credit: 'NASA/GSFC/METI/ERSDAC/JAROS, and U.S./Japan ASTER Science Team',
        sourceUrl: 'https://www.nasa.gov/image-article/dry-valleys-antarctica/',
        sourceLabel: 'NASA — Dry Valleys, Antarctica (PIA12461)',
        width: 1200,
        height: 1333,
      },
    },
    {
      id: 'similarities',
      title: 'Similarities',
      paragraphs: ['Several key characteristics make the McMurdo Dry Valleys a great fit for Hale Crater. They share some features with it; they are not the same.'],
      subsections: [
        {
          title: 'Terrain Morphology',
          paragraphs: [
            'Both locations have rocky slopes that allow linear features to form downslope. [[6]] [[2]] By comparing slope angles and surrounding geological structures, scientists can understand the influence topography has on RSL.',
          ],
        },
        {
          title: 'Seasonal Patterns and Water',
          tag: 'Debated on Mars',
          paragraphs: [
            'Wet streaks in Antarctica can be attributed to seasonal snowmelt, while RSL on Mars are sometimes associated with seasonal brine. [[3]] Whether water plays any role in RSL is still actively debated (see Hale’s RSL Mechanisms). [[7]] Studying how water moves through these Antarctic soils provides a real-world example of processes in extremely dry environments.',
          ],
        },
        {
          title: 'Mineralogy',
          paragraphs: [
            'The South Fork of Wright Valley is rich in calcium chloride salts, which absorb atmospheric moisture under certain conditions. [[2]] This makes the region very useful for exploring salt–water interactions and comparing them with possible brine mechanisms on Mars.',
          ],
        },
        {
          title: 'Appearance',
          paragraphs: ['On a basic level, Antarctic wet streaks and RSL on Mars both appear as dark markings on lighter terrain. [[3]] [[4]]'],
        },
      ],
    },
  ],
};
