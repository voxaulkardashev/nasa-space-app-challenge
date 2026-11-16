import type { ResearchCitation, SiteResearch } from './siteResearch';
import type { SourceRef } from './types';

/**
 * Elysium Planitia: the team's research for the Compare view's Mars column, in the
 * usual six sections. Text is the team's, edited for clarity and corrected where the
 * cited sources say something different (see docs/SOURCES.md).
 */

export const INSIGHT_API_DOCS = 'https://api.nasa.gov/assets/insight/InSight%20Weather%20API%20Documentation.pdf';
/** When the copy of the InSight Weather API reply (src/data/insightWeatherSnapshot.json) was saved. */
export const INSIGHT_API_SAVED = '16 November 2026';

const ACCESSED = '16 November 2026';

const CITATIONS: ResearchCitation[] = [
  {
    n: 1,
    title: 'Voigt, J. R. C. et al. (2023). Revealing Elysium Planitia’s Young Geologic History: Constraints on Lava Emplacement, Areas, and Volumes. JGR Planets 128.',
    url: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2023JE007947',
  },
  {
    n: 2,
    title: 'Hobiger, M. et al. (2021). The shallow structure of Mars at the InSight landing site from inversion of ambient vibrations. Nature Communications 12, 6756. doi:10.1038/s41467-021-26957-7',
    url: 'https://doi.org/10.1038/s41467-021-26957-7',
  },
  { n: 3, title: 'Universe Today — InSight Peers Deep Below the Surface on Mars (30 Nov 2021)', url: 'https://www.universetoday.com/articles/insight-peers-deep-below-the-surface-on-mars' },
  { n: 4, title: 'Horvath, D. G. et al. (2021). Evidence for geologically recent explosive volcanism in Elysium Planitia, Mars. Icarus 365, 114499.', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0019103521001779' },
  { n: 5, title: 'Golombek, M. et al. (2016). Surface and Subsurface Characteristics of Western Elysium Planitia, Mars. 47th LPSC, abstract 1572.', url: 'https://www.hou.usra.edu/meetings/lpsc2016/pdf/1572.pdf' },
  { n: 6, title: 'Golombek, M. et al. (2020). Geology of the InSight landing site on Mars. Nature Communications 11, 1014. doi:10.1038/s41467-020-14679-1', url: 'https://doi.org/10.1038/s41467-020-14679-1' },
  { n: 7, title: 'NASA JPL — A Collection of Landforms in Eastern Elysium Planitia, PIA18831 (15 Oct 2014)', url: 'https://www.jpl.nasa.gov/images/pia18831-a-collection-of-landforms-in-eastern-elysium-planitia/' },
  { n: 8, title: 'Lunar and Planetary Institute — slide: lava flow field west of Hecates Tholus', url: 'https://www.lpi.usra.edu/publications/slidesets/hawaiivolcanoes/slidespages/slide_06.shtml' },
  { n: 9, title: 'IAU/USGS Gazetteer of Planetary Nomenclature — Elysium quadrangle (MC-15), MOLA topographic map', url: 'https://asc-planetarynames-data.s3.us-west-2.amazonaws.com/mc15_mola.pdf' },
  { n: 10, title: 'IAU/USGS Gazetteer of Planetary Nomenclature — Elysium Planitia (feature 1784)', url: 'https://planetarynames.wr.usgs.gov/Feature/1784' },
  { n: 11, title: 'NASA — InSight Weather API documentation', url: INSIGHT_API_DOCS },
  { n: 12, title: 'NASA NSSDCA — InSight Mars Lander spacecraft record (2018-042A)', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A' },
  { n: 13, title: 'NASA Science — Mars: Facts', url: 'https://science.nasa.gov/mars/facts/' },
  { n: 14, title: 'NASA NSSDCA — Earth Fact Sheet (surface pressure 1014 mb)', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html' },
];

const API_SOURCE: SourceRef = {
  name: 'NASA InSight Weather API, sols 675–681 (19–26 Oct 2020)',
  url: INSIGHT_API_DOCS,
  sourceDate: 'Sols 675–681, 19–26 October 2020',
  accessed: ACCESSED,
};

const GAZ_ELYSIUM: SourceRef = {
  name: 'IAU/USGS Gazetteer — Elysium Planitia (feature 1784)',
  url: 'https://planetarynames.wr.usgs.gov/Feature/1784',
  sourceDate: 'Record date not stated',
  accessed: ACCESSED,
};

export const ELYSIUM_RESEARCH: SiteResearch = {
  siteId: 'elysium-planitia',
  citations: CITATIONS,
  otherCredits: [
    {
      title: 'ResearchGate — figure “Overview of the study site in Elysium Planitia” (supplied by the team; not opened from our environment)',
      url: 'https://www.researchgate.net/figure/Overview-of-the-study-site-black-outline-in-Elysium-Planitia-which-is-a-plains-forming_fig1_376549956',
    },
  ],
  sections: [
    {
      id: 'minerals',
      title: 'Mineral Composition',
      paragraphs: [
        'Elysium Planitia is made mainly of basaltic lava, iron-rich volcanic rock that is also among the most common volcanic rock on Earth. [[1]]',
        'Directly beneath NASA’s InSight lander there are about 3 meters of loose, sandy regolith, and under that a roughly 15-meter layer of coarse, rocky ejecta thrown out by meteorite impacts. [[3]] [[2]]',
        'Radar data and surface images show that the broader region was built by about 40 episodes of effusive (flowing) basaltic lava eruptions. [[1]]',
        'A fine-grained deposit spread symmetrically around a Cerberus Fossae fissure has been interpreted as material from geologically recent explosive volcanism; the team’s research describes it as rich in high-calcium pyroxene. [[4]]',
        'The region also experienced massive ancient floods of water. Sedimentary layers lie between older and younger lava flows [[2]], and any present-day ground ice is likely limited to local patches. [[1]]',
        'An image of a lava flow field just west of the volcano Hecates Tholus, with several flows more than 100 km long, is on the Lunar and Planetary Institute’s page (it could not be downloaded from our environment). [[8]]',
      ],
    },
    {
      id: 'terrain',
      title: 'Terrain and Landforms',
      paragraphs: [
        'Elysium Planitia is a broad, relatively smooth volcanic plain that straddles the Martian equator. [[10]] It is the youngest volcanic terrain on Mars [[1]], and the team’s research notes that it has experienced significant seismic activity.',
        'Dozens of volcanic episodes produced extensive basaltic lava flows, giving parts of the plain plate-like (“platy”) or fragmented crusts. [[1]] [[5]]',
        'Ancient channels, including Athabasca Valles, Marte Vallis and Rahway Valles, were likely carved by enormous floods of water and later filled in by younger lava flows. [[1]]',
        'Cerberus Fossae is a system of deep, parallel fissures and graben (blocks of crust that have dropped down between parallel faults). It is linked to relatively recent volcanic activity and to past releases of underground water. [[1]] [[4]]',
        'Compared with the older Martian highlands, the plain has relatively few large impact craters; nearby named craters include Eddie, Lockyer and Tombaugh. [[9]] Transition zones contain mesas, fretted terrain, pits and dark slope streaks made by dust avalanches. [[7]]',
        'Although Elysium Planitia itself is low and flat, it borders the Elysium volcanic province, with the shield volcanoes Elysium Mons, Albor Tholus and Hecates Tholus. [[9]]',
      ],
      facts: [
        {
          id: 'elysium-insight-site',
          label: 'InSight landing site (map marker)',
          value: '4.502° N, 135.623° E',
          status: 'estimated',
          method:
            'InSight lander position supplied by the team. It agrees with NASA’s record that InSight landed in western Elysium Planitia, and with the centre of InSight’s landing ellipse (4.4° N, 135.8° E). The marker shows the landing site, not the centre of the whole plain.',
          source: {
            name: 'Golombek et al. (2016), LPSC abstract 1572 — landing ellipse E9 centre 4.4° N, 135.8° E',
            url: 'https://www.hou.usra.edu/meetings/lpsc2016/pdf/1572.pdf',
            sourceDate: '2016',
            accessed: ACCESSED,
          },
        },
        { id: 'elysium-plain', label: 'Elysium Planitia (whole plain)', value: 'centre 2.98° N, 154.74° E; about 3,000 km across', status: 'measured', source: GAZ_ELYSIUM },
      ],
      figure: {
        src: 'images/elysium/eastern-elysium-landforms-pia18831.jpg',
        alt: 'Orbital image of eastern Elysium Planitia: flat lava plains in the north, slopes with dark streaks, and pits, fretted terrain and channels in the south.',
        caption:
          'Landforms in eastern Elysium Planitia: the northern part is probably an ancient lava field; dark streaks on the slopes may be recently disturbed material (dust avalanches); to the south are a line of pits, fretted terrain, and channels and depressions.',
        credit: 'NASA/JPL-Caltech/Univ. of Arizona',
        sourceUrl: 'https://www.jpl.nasa.gov/images/pia18831-a-collection-of-landforms-in-eastern-elysium-planitia/',
        sourceLabel: 'A Collection of Landforms in Eastern Elysium Planitia (PIA18831)',
        width: 1200,
        height: 750,
      },
    },
    {
      id: 'soil',
      title: 'Soil Properties',
      paragraphs: [
        'The surface materials and lava flows are mainly volcanic basalt, broken up into regolith by impacts. [[6]] [[5]]',
        'At the InSight landing site, the lander’s rockets exposed a near-surface profile of: a thin layer of surface dust; loose sand; a duricrust (cemented soil) of variable thickness; and loose sand mixed with rocks, above the basaltic bedrock. [[6]]',
        'Across the area the regolith is about 3 to 6 meters thick [[5]], above stacked basaltic lava flows with a sedimentary layer between them. [[2]] [[3]]',
        'Subsurface ice is thought to exist mainly in isolated patches, even though the region saw major ancient floods and lava–water interactions. [[1]]',
        'Perchlorate salts are considered a possible component of Martian regolith and a hazard for explorers, but InSight did not directly measure them at its landing site.',
      ],
    },
    {
      id: 'life',
      title: 'Signs of Past Life',
      paragraphs: [
        'No signs of past life have been confirmed in Elysium Planitia.',
        'The region does hold substantial evidence of ancient liquid water: massive flood channels and places where lava met water or ice. [[1]]',
        'When lava flowed over underground water or ice, the heat could have caused steam explosions, and such interactions may have created warm, mineral-rich (hydrothermal) environments. On Earth, some hydrothermal environments, such as deep-sea vents, support microbial life.',
        'These are signs of conditions that could have been habitable, not evidence that life existed.',
      ],
    },
    {
      id: 'weather',
      title: 'Temperature/Weather',
      paragraphs: [
        'NASA’s InSight lander measured weather at its landing site until its mission ended in December 2022. [[12]] The InSight Weather API was built to share those measurements. [[11]] Today it still returns only the 7 sols listed below, from October 2020, so they are shown as historical observations, never as current weather.',
        'In those 7 sols, daytime highs ranged from about −16.9 °C to −4.4 °C, night-time lows fell to about −95 °C to −98 °C, and daily average temperatures were about −62 °C to −63 °C. Winds blew mostly from the west-northwest, averaging about 19 to 31 km/h each sol, with stronger gusts. Average pressure was about 744 to 751 Pa: less than 1% of Earth’s average surface pressure (about 101,400 Pa). [[11]] [[14]]',
        'Because the atmosphere is so thin, heat from the Sun escapes easily after sunset, which drives these large daily temperature swings. [[13]]',
      ],
      facts: [
        { id: 'insight-high', label: 'Daytime highs (sols 675–681)', value: '−16.9 to −4.4 °C', status: 'measured', source: API_SOURCE },
        { id: 'insight-low', label: 'Night-time lows (sols 675–681)', value: '−95.4 to −97.7 °C', status: 'measured', source: API_SOURCE },
      ],
      historicalWeather: 'insight',
    },
    {
      id: 'elevation',
      title: 'Elevation',
      paragraphs: [
        'Elysium Planitia lies in the northern lowlands of Mars. The team’s research gives its general elevation as about 2,500 to 2,650 meters below the Martian zero-elevation datum. NASA’s MOLA laser-altimeter data, averaged over a 15 km grid cell at the InSight marker, gives about −2,630 m, within that range (shown on the Explore panel).',
        'The topographic map below shows the Elysium quadrangle: the shield volcano Elysium Mons in high-elevation red and white, while most of Elysium Planitia is low-lying blue-green plains. [[9]]',
      ],
      figure: {
        src: 'images/elysium/elysium-mc15-mola-usgs.jpg',
        alt: 'Colour-shaded topographic map of the Elysium quadrangle from 0° to 30° N and 135° to 180° E: Elysium Mons in red and white, the plains in green and blue, with an elevation colour scale.',
        caption:
          'Elysium quadrangle (MC-15), 0–30° N, 135–180° E, Mercator projection, with its elevation colour scale. Elysium Mons is the red-and-white peak; InSight landed near the lower-left corner (4.5° N, 135.6° E). Cropped from the map PDF.',
        credit: 'IAU/USGS Gazetteer of Planetary Nomenclature (MOLA topography)',
        sourceUrl: 'https://asc-planetarynames-data.s3.us-west-2.amazonaws.com/mc15_mola.pdf',
        sourceLabel: 'Elysium, MC-15 (MOLA topographic map, PDF)',
        width: 1400,
        height: 1137,
      },
    },
  ],
};
