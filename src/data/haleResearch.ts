import type { ResearchCitation, SiteResearch } from './siteResearch';
import type { SourceRef } from './types';

/**
 * Hale Crater and Recurring Slope Lineae (RSL): the team's research for the
 * Compare view's site column, in the team's five sections. Text is the team's,
 * with grammar edits and sentences added only where a cited source supports them.
 * Each citation was checked against the statement it follows (docs/SOURCES.md).
 */

const ACCESSED = '16 November 2026';

const CITATIONS: ResearchCitation[] = [
  {
    n: 1,
    title:
      'Munaretto, G. et al. (2020). Implications for the origin and evolution of Martian Recurring Slope Lineae at Hale crater from CaSSIS observations. Planetary and Space Science 187, 104947. doi:10.1016/j.pss.2020.104947',
    url: 'https://doi.org/10.1016/j.pss.2020.104947',
  },
  {
    n: 2,
    title: 'McEwen, A. S. et al. (2011). Seasonal Flows on Warm Martian Slopes. Science 333, 740–743. doi:10.1126/science.1204816',
    url: 'https://doi.org/10.1126/science.1204816',
  },
  { n: 3, title: 'NASA Photojournal PIA19916 — Recurring ‘Lineae’ on Slopes at Hale Crater, Mars (28 Sep 2015)', url: 'https://science.nasa.gov/photojournal/recurring-lineae-on-slopes-at-hale-crater-mars/' },
  { n: 4, title: 'NASA Photojournal PIA22070 — Seasonal Dark Streaks in Tivat Crater, Mars (20 Nov 2017)', url: 'https://science.nasa.gov/photojournal/seasonal-dark-streaks-in-tivat-crater-mars/' },
  {
    n: 5,
    title: 'Dundas, C. M. et al. (2017). Granular flows at recurring slope lineae on Mars indicate a limited role for liquid water. Nature Geoscience 10, 903–907. doi:10.1038/s41561-017-0012-5',
    url: 'https://doi.org/10.1038/s41561-017-0012-5',
  },
  { n: 6, title: 'NASA Photojournal PIA19359 — Seasonal Flows in the Central Mountains of Hale Crater (8 Apr 2015)', url: 'https://science.nasa.gov/photojournal/seasonal-flows-in-the-central-mountains-of-hale-crater/' },
  { n: 7, title: 'NASA Photojournal PIA17734 — Active Slope Flows on the Central Hills of Hale Crater (29 May 2013)', url: 'https://science.nasa.gov/photojournal/active-slope-flows-on-the-central-hills-of-hale-crater/' },
  { n: 8, title: 'NASA Photojournal PIA22994 — Hale Crater (THEMIS, 11 Jan 2019)', url: 'https://science.nasa.gov/photojournal/hale-crater-3/' },
  { n: 9, title: 'IAU/USGS Gazetteer of Planetary Nomenclature — Hale (feature 2322)', url: 'https://planetarynames.wr.usgs.gov/Feature/2322' },
  {
    n: 10,
    title: 'Ojha, L. et al. (2015). Spectral evidence for hydrated salts in recurring slope lineae on Mars. Nature Geoscience 8, 829–832. doi:10.1038/ngeo2546',
    url: 'https://doi.org/10.1038/ngeo2546',
  },
  {
    n: 11,
    title:
      'Leask, E. K. et al. (2018). Challenges in the Search for Perchlorate and Other Hydrated Minerals With 2.1-μm Absorptions on Mars. Geophysical Research Letters 45. doi:10.1029/2018GL080077',
    url: 'https://doi.org/10.1029/2018GL080077',
  },
  {
    n: 12,
    title:
      'Gough, R. V. et al. (2020). Changes in Soil Cohesion Due to Water Vapor Exchange: A Proposed Dry-Flow Trigger Mechanism for Recurring Slope Lineae on Mars. Geophysical Research Letters 47, e2020GL087618. doi:10.1029/2020GL087618',
    url: 'https://doi.org/10.1029/2020GL087618',
  },
  { n: 13, title: 'NASA Photojournal PIA22114 — Transient Slope Lineae Formation in a Well-Preserved Crater (20 Nov 2017)', url: 'https://science.nasa.gov/photojournal/transient-slope-lineae-formation-in-a-well-preserved-crater/' },
  { n: 14, title: 'NASA Photojournal PIA21608 — Seasonal Flows in Valles Marineris (4 May 2017)', url: 'https://science.nasa.gov/photojournal/seasonal-flows-in-valles-marineris/' },
  { n: 15, title: 'NASA Photojournal PIA23101 — Bedrock in the Central Peaks of Hale Crater (18 Mar 2019)', url: 'https://science.nasa.gov/photojournal/bedrock-in-the-central-peaks-of-hale-crater/' },
];

const GAZETTEER: SourceRef = {
  name: 'IAU/USGS Gazetteer of Planetary Nomenclature — Hale (feature 2322)',
  url: 'https://planetarynames.wr.usgs.gov/Feature/2322',
  sourceDate: 'Name adopted by the IAU in 1973; record date not stated',
  accessed: ACCESSED,
};

const TREK_CREDIT = 'NASA Solar System Treks (Mars Trek); map assembled and cropped by our team';

export const HALE_RESEARCH: SiteResearch = {
  siteId: 'hale',
  citations: CITATIONS,
  sections: [
    {
      id: 'background',
      title: 'Background',
      paragraphs: [
        'Thousands of mysterious Recurring Slope Lineae (RSL) mark the Martian surface: NASA’s HiRISE camera has confirmed many thousands of them at more than 50 sites. [[4]] These narrow, dark streaks appear on steep slopes in warm seasons, gradually extend downhill, fade in the cold season and come back the next Mars year. [[4]] [[2]] They are an exciting subject of planetary science because the way they form is still not fully understood. [[14]]',
        'RSL were first identified in 2011 in images from the HiRISE camera on NASA’s Mars Reconnaissance Orbiter (MRO). [[2]] [[4]]',
        'RSL were once thought to indicate flowing salty liquid water (brine). [[2]] [[3]] However, newer studies point toward dry granular flows (sand and dust moving downhill) as a possible explanation instead of liquid water. [[5]] [[1]] Neither explanation has been proven; see RSL Mechanisms below.',
      ],
      figure: {
        src: 'images/hale/rsl-hale-pia19916.jpg',
        alt: 'False-colour 3-D view of a slope in Hale Crater with many narrow dark streaks running downhill.',
        caption:
          'Dark, narrow streaks (RSL) on slopes at Hale Crater, each roughly the length of a football field. HiRISE false-colour image draped over a 3-D terrain model made from two HiRISE stereo images; heights exaggerated 1.5×. (NASA’s 2015 caption calls the salt detection evidence for briny water; later studies question this, see below.)',
        credit: 'NASA/JPL-Caltech/Univ. of Arizona',
        sourceUrl: 'https://science.nasa.gov/photojournal/recurring-lineae-on-slopes-at-hale-crater-mars/',
        sourceLabel: 'Recurring ‘Lineae’ on Slopes at Hale Crater, Mars (PIA19916)',
        width: 1200,
        height: 623,
      },
      map: 'rsl-sites',
    },
    {
      id: 'hale',
      title: 'Hale Crater',
      paragraphs: [
        'Hale Crater is a prominent impact crater in Mars’ southern hemisphere, near the northern edge of the Argyre basin (Argyre Planitia). [[8]] [[9]] NASA describes it as an oval crater made by an oblique (low-angle) impact. [[8]]',
        'Hale Crater’s central peaks, made of uplifted bedrock, are the site of many RSL: HiRISE images show thousands of seasonal flows on steep slopes below bedrock outcrops, and NASA calls the central peaks one of the most active RSL sites known. [[7]] [[6]] [[15]]',
        'RSL at Hale Crater are particularly interesting because they became active much earlier than most RSL sites in the southern mid-latitudes and were well developed in early southern spring. They also have an unusual reddish appearance in HiRISE colour images. [[6]]',
        'This makes Hale Crater an important location for understanding Recurring Slope Lineae.',
      ],
      facts: [
        { id: 'hale-centre', label: 'Crater centre', value: '35.78° S, 323.50° E', status: 'measured', source: GAZETTEER },
        { id: 'hale-diameter', label: 'Diameter', value: '149 km', note: 'NASA image captions give about 150 km', status: 'measured', source: GAZETTEER },
      ],
      figure: {
        src: 'images/hale/hale-overview-viking-trek.jpg',
        alt: 'Orbital colour mosaic of Hale Crater: a large oval crater with a smooth floor and a ridge of peaks in the middle, surrounded by older cratered terrain.',
        caption:
          'Hale Crater and its surroundings (33.0–38.4° S, 319.8–327.4° E; north is up). The ridge of central peaks, where the RSL are, sits in the middle of the oval floor. Viking Orbiter colour mosaic (MDIM 2.1); colours are approximate.',
        credit: TREK_CREDIT,
        sourceUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml',
        sourceLabel: 'Mars Trek layer Mars_Viking_MDIM21_ClrMosaic_global_232m',
        width: 1100,
        height: 783,
      },
    },
    {
      id: 'minerals',
      title: 'RSL Mineral Composition',
      paragraphs: [
        'Expanding our knowledge of Recurring Slope Lineae is crucial for future human exploration of Mars, because RSL might reveal information about Martian chemistry, seasonal processes and how water is distributed on the planet.',
        'Understanding RSL will help scientists assess Martian environments, investigate potential water-related resources for astronauts, and identify future locations of interest for Mars missions.',
        'No complete mineral composition of RSL is known. What has been reported falls into two groups:',
        'Detected in association with RSL (on the slopes where RSL occur, seen from orbit): in 2015, a study using the CRISM spectrometer on NASA’s Mars Reconnaissance Orbiter reported spectral evidence for hydrated salts at RSL, including on the slopes at Hale Crater. [[10]] [[3]] Later, a 2018 study found an artefact in CRISM data that can mimic real mineral absorptions and concluded that few to none of the perchlorate detections reported in published literature remain robust. [[11]] Which salts, if any, are present at RSL is therefore debated.',
        'Hale’s RSL also look unusually reddish in HiRISE colour; NASA suggests this is “perhaps due to oxidized iron compounds, like rust”. That is a possible explanation, not a mineral detection. [[6]]',
        'Confirmed as part of the streaks themselves: none, in the sources we checked.',
      ],
    },
    {
      id: 'terrain',
      title: 'Crater Terrain',
      paragraphs: [
        'Hale Crater’s terrain is characterised by exposed bedrock, complex topography created by the impact, and steep slopes. [[15]] [[7]] [[8]]',
        'The impact that formed Hale also built its central mountain range [[8]]; in large craters, such peaks are made of deeper rock lifted up as the crater forms. These uplifted bedrock slopes are the formations on which Hale’s RSL develop. [[7]]',
        'RSL activity is associated with steep terrain. [[1]] [[7]]',
        'Pairs of HiRISE stereo images are used to build digital elevation models (3-D terrain models), so scientists can study slope angles, elevation differences and where individual lineae occur. [[3]] [[1]]',
        'In 2020, an investigation of Hale’s central peak identified 125 RSL (in some cases groups of RSL) that were visible in both CaSSIS images (from ESA’s ExoMars Trace Gas Orbiter) and HiRISE images, and found that most of the RSL lengthening it observed happened on slopes steeper than 30–32 degrees. [[1]]',
      ],
      figure: {
        src: 'images/hale/hale-topography-mola-trek.jpg',
        alt: 'Colour-shaded relief map of Hale Crater: the crater floor in green and blue, the surrounding highlands in orange, and the central peaks as a shaded ridge.',
        caption:
          'Topography of the same area: colour shows height from NASA’s MOLA laser altimeter (orange and brown higher, green and blue lower; the tiles come without a numeric scale), with hill shading.',
        credit: TREK_CREDIT,
        sourceUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/WMTSCapabilities.xml',
        sourceLabel: 'Mars Trek layer Mars_MGS_MOLA_ClrShade_merge_global_463m',
        width: 1100,
        height: 783,
      },
    },
    {
      id: 'mechanisms',
      title: 'RSL Mechanisms',
      paragraphs: [
        'The exact explanation for RSL is still unknown, and the role of water is a matter of active scientific debate. [[14]] Liquid brine and dry granular flows are two possible causes. Neither has been proven.',
      ],
      subsections: [
        {
          title: 'Liquid brine hypothesis',
          tag: 'Debated',
          paragraphs: [
            'This hypothesis suggests that salty water (brine) might seep and move down slopes during warmer seasons, creating the dark RSL streaks that scientists observe. [[2]] [[6]]',
            'The seasonal appearance of RSL and the reported detection of hydrated salts have been considered evidence supporting this hypothesis. [[2]] [[10]] [[3]] The salt detections have since been questioned (see RSL Mineral Composition). [[11]]',
          ],
        },
        {
          title: 'Dry granular-flow hypothesis',
          tag: 'Debated',
          paragraphs: [
            'Another hypothesis suggests that RSL are dry flows of sand and dust. A 2017 study found that RSL end on slopes similar to the angle of repose for sand, as expected for flowing grains. [[5]] [[13]] The 2020 CaSSIS study of Hale also found RSL there are better explained as dry granular flows than as seeping water. [[1]]',
            'One proposed trigger, tested for Hale Crater, involves changes in soil cohesion linked to water vapour in the atmosphere: when salts in the soil lose their water in warm seasons, the soil becomes less cohesive, slopes can fail, and darker material underneath is exposed as grains move downhill. [[12]]',
            'This hypothesis offers a possible explanation for RSL without requiring liquid water.',
          ],
        },
      ],
      figure: {
        src: 'images/hale/tivat-rsl-pia22114.jpg',
        alt: 'Enhanced-colour orbital image of a crater slope with many narrow dark streaks running from the lower right towards the upper left.',
        caption:
          'RSL in Tivat Crater (enhanced colour; flows run downhill towards the upper left). The flows all end at about the same slope, similar to the angle of repose for sand, which is evidence for the dry granular-flow hypothesis.',
        credit: 'NASA/JPL-Caltech/Univ. of Arizona',
        sourceUrl: 'https://science.nasa.gov/photojournal/transient-slope-lineae-formation-in-a-well-preserved-crater/',
        sourceLabel: 'Transient Slope Lineae Formation in a Well-Preserved Crater (PIA22114)',
        width: 1200,
        height: 750,
      },
      notes: ['Both hypotheses remain under investigation. Liquid water flowing on present-day Mars is not an established fact.'],
    },
  ],
};
