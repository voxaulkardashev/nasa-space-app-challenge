import type { ResearchCitation, SiteResearch } from './siteResearch';
import type { SourceRef } from './types';

/**
 * Lake Lappajärvi, Finland: the team's research for the Compare view's Earth column, shown
 * next to Jezero. Text is the team's, edited for clarity and corrected where sources differ
 * (see docs/SOURCES.md). Links are kept exactly as the team gave them.
 */

const ACCESSED = '16 November 2026';

const CITATIONS: ResearchCitation[] = [
  { n: 1, title: 'Crater Lake Lappajärvi Geopark — Birth of the crater lake', url: 'https://kraatterijarvigeopark.fi/birth-of-the-crater-lake' },
  {
    n: 2,
    title:
      'Gustafsson, H. et al. (2025). Deep microbial colonization during impact-generated hydrothermal circulation at the Lappajärvi impact structure, Finland. Nature Communications (PubMed Central copy)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12443983/',
  },
  { n: 3, title: 'Same study, published version — Nature Communications (17 Sep 2025)', url: 'https://www.nature.com/articles/s41467-025-63603-y' },
  { n: 4, title: 'Bulletin of the Geological Society of Finland 42, pp. 89–93 (Lehtinen) — shock minerals at Lake Lappajärvi', url: 'https://www.geologinenseura.fi/sites/geologinenseura.fi/files/sgs_bt_042_pages_089_093.pdf' },
  {
    n: 5,
    title: 'Schmieder, M. & Jourdan, F. (2013). The Lappajärvi impact structure (Finland): Age, duration of crater cooling, and implications for early life. Geochimica et Cosmochimica Acta 112, 321–339.',
    url: 'https://www.sciencedirect.com/science/article/pii/S0016703713001105',
  },
  {
    n: 6,
    title: 'Diamonds in impactites of the Lappajärvi impact structure — Russian Geology and Geophysics 40(10), 1487',
    url: 'https://pubs.geoscienceworld.org/nsu/rgg/article-abstract/40/10/1487/649265/DIAMONDS-IN-IMPACTITES-OF-THE-LAPPAJARVI-IMPACT',
  },
  { n: 7, title: 'Central Baltic GEOISLANDS project — Meteorite craters (report)', url: 'https://projects.centralbaltic.eu/images/files/result_pdf/GEOISLANDS_result1_meteorite_craters.pdf' },
  { n: 8, title: 'Lappajärvi municipality — Ympäristö ja luonto (environment and nature; lake facts)', url: 'https://lappajarvi.fi/asuminen-ja-ymparisto/ymparisto-ja-luonto/' },
  { n: 9, title: 'Wikimedia Commons — Lappajärvi from satellite.png', url: 'https://commons.wikimedia.org/wiki/File:Lappaj%C3%A4rvi_from_satellite.png' },
  { n: 10, title: 'Lakelubbers — Lake Lappajärvi, Finland (fish species)', url: 'https://lakelubbers.com/lake/lake-lappajarvi-finland/#fish-species' },
  { n: 11, title: 'NASA POWER — Hourly API', url: 'https://power.larc.nasa.gov/docs/services/api/temporal/hourly/' },
  {
    n: 12,
    title: 'NASA JPL — NASA’s Perseverance Rover Deciphers Ancient History of Martian Lake (12 Dec 2023)',
    url: 'https://www.jpl.nasa.gov/news/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/',
  },
];

const MUNICIPALITY: SourceRef = {
  name: 'Lappajärvi municipality — Ympäristö ja luonto (lake facts table)',
  url: 'https://lappajarvi.fi/asuminen-ja-ymparisto/ymparisto-ja-luonto/',
  sourceDate: 'Page date not stated',
  accessed: ACCESSED,
};
const GEOPARK: SourceRef = { name: 'Crater Lake Lappajärvi Geopark — Birth of the crater lake', url: 'https://kraatterijarvigeopark.fi/birth-of-the-crater-lake', sourceDate: 'Page date not stated', accessed: ACCESSED };

export const LAPPAJARVI_RESEARCH: SiteResearch = {
  siteId: 'lake-lappajarvi',
  citations: CITATIONS,
  sections: [
    {
      id: 'overview',
      title: 'Background / Overview',
      paragraphs: [
        'Lake Lappajärvi, in western Finland, is Europe’s largest crater lake. [[1]] It fills an ancient impact structure about 22–23 km across that formed when a meteorite struck the region about 78 million years ago (dated at 77.85 ± 0.78 million years). [[1]] [[3]]',
        'Today the lake measures about 17 × 35 km, with an average depth of about 7.4 m and a maximum depth of about 36–38 m (sources differ). [[1]] [[8]]',
        'The impact created distinctive rocks and minerals that preserve evidence of the extreme pressure and heat of the collision. [[1]] [[4]]',
        'Why compare it with Jezero: both are impact craters with impact-related rocks, and both help scientists read the history of planetary surfaces. Their histories are not the same: Lappajärvi is a crater on Earth that holds a lake today, while Jezero is an ancient Martian crater that once held a lake fed by a river delta. [[12]]',
      ],
      facts: [
        {
          id: 'lappajarvi-coords',
          label: 'Coordinates (approximate lake centre)',
          value: '63.20° N, 23.70° E',
          status: 'estimated',
          method: 'Approximate centre of the lake supplied by the team (rounded to 0.01°); the marker sits on the lake, not on a nearby town. Not from an official gazetteer.',
        },
      ],
      figure: {
        src: 'images/lappajarvi/lappajarvi-from-satellite.png',
        alt: 'Satellite view of Lake Lappajärvi: a dark, elongated lake among green farmland and forest, with a large island near its middle.',
        caption: 'Satellite view of Lake Lappajärvi, Finland. The southern part of the lake is the ancient meteorite crater.',
        credit: 'NASA, modified by MPorciusCato (public domain, via Wikimedia Commons)',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lappaj%C3%A4rvi_from_satellite.png',
        sourceLabel: 'Wikimedia Commons — Lappajärvi from satellite.png',
        width: 453,
        height: 447,
      },
    },
    {
      id: 'minerals',
      title: 'Mineral Composition',
      paragraphs: [
        'The meteorite impact changed the minerals of the local rocks more than anything else. Geologist Martti Lehtinen, whose 1976 doctoral work proved the crater’s impact origin [[1]], identified minerals and structures that form only under extreme shock pressure [[4]]:',
        'Coesite, a high-pressure form of quartz; maskelynite, feldspar (plagioclase) turned into glass by shock; diaplectic quartz and microcline glasses, minerals turned to glass by shock without melting; planar features in quartz and feldspar; and kink bands in biotite, graphite and plagioclase. [[4]]',
        'Quartz and feldspar make up most of the impact rocks, and coesite and the other shock minerals are strong evidence that Lappajärvi was made by an impact. The impact rocks also contain 10–20 times more nickel than the surrounding bedrock, another sign of the meteorite. [[4]] Rare diamonds have also been found in the impact rocks. [[1]] [[6]]',
        'Later, water flowing through fractures in the impact rocks deposited secondary minerals: calcite, chalcedony, zeolites (most commonly heulandite) and pyrite. [[4]] [[2]]',
      ],
    },
    {
      id: 'terrain',
      title: 'Terrain and Landforms',
      paragraphs: [
        'Lake Lappajärvi fills an elongated, roughly oval basin about 17 × 35 km, inside an impact crater about 22 km across. [[1]] The deepest parts of the lake lie along two troughs running north-northwest on its eastern and western sides.',
        'Kärnäsaari, the lake’s largest island, is the original central uplift of the crater. It is made of kärnäite, a very hard impact melt rock full of rock and mineral fragments that has protected the island from erosion. [[1]] The rock has also been quarried as building stone.',
        'Suevite, a fragile mix of crushed and melted rock that fell back from the explosion, is found only in deep drill-hole samples and in gravel deposits south and southeast of the lake. [[1]] Scientific drilling found the crater depression beneath the lake filled with more than 200 m of melted and broken rock.',
        'Ice ages have flattened the crater, but parts of its raised rim survive, especially to the south, at Lakeaharju and Pyhävuori. [[1]]',
      ],
    },
    {
      id: 'soil',
      title: 'Soil Properties',
      paragraphs: [
        'Impact-formed rocks: kärnäite (impact melt rock) on Kärnäsaari, suevite in drill cores and in gravel deposits south and southeast of the lake [[1]], and fallout breccia rich in shocked minerals. [[4]]',
        'Lake sediments: sediment cores taken from the lake bottom in 1998 record changes in the lake’s water quality over the last century. [[8]]',
        'Surrounding surface soils: detailed soil information has not yet been established for this comparison, so no soil measurements are shown.',
      ],
    },
    {
      id: 'life',
      title: 'Signs of Past Life',
      paragraphs: [
        'The impact created a long-lasting hydrothermal system: hot water circulated through the fractured rocks as the crater slowly cooled. [[3]] [[5]]',
        'A 2025 study in Nature Communications found ancient biosignatures in minerals filling fractures and cavities in the impact rocks [[2]] [[3]]:',
        'Pyrite: the first minerals to form at temperatures habitable for life (47.0 ± 7.1 °C), about 73.6 ± 2.2 million years ago, include pyrite with sulfur isotopes consistent with microbial sulfate reduction. [[3]]',
        'Calcite: more than 10 million years later, at lower temperatures, calcite formed with carbon isotopes showing that microbes both produced and consumed methane. [[3]]',
        'These are ancient microbial signatures preserved in the rocks, not evidence of living microbes in the lake today, and the impact did not create life. It created long-lasting warm, wet conditions that microbes later colonized as the crater cooled. [[3]] Today the lake is home to fish such as perch and pike. [[10]]',
        'This links closely to Jezero: scientists want to know whether ancient impact craters on Mars could also have hosted habitable hydrothermal systems.',
      ],
    },
    {
      id: 'weather',
      title: 'Temperature/Weather',
      paragraphs: ['Below are the newest weather values for Lake Lappajärvi from NASA POWER, the same NASA service the website uses for other Earth sites. They load each time you open this view. [[11]]'],
      liveEarth: { lat: 63.2, lon: 23.7, place: 'Lake Lappajärvi, Finland', timeZone: 'Europe/Helsinki' },
    },
    {
      id: 'elevation',
      title: 'Elevation',
      paragraphs: [
        'The landscape around the lake is relatively flat, but surviving parts of the crater rim rise higher, mainly on the southern side. [[1]]',
        'At Lakeaharju, on the southern shore, the crater rim rises about 100 m above the lake surface. [[1]] The lake’s average water level is 69.5 m above sea level. [[8]] These are two different measurements: the rim height is measured from the lake surface, not from sea level.',
      ],
      facts: [
        { id: 'lappajarvi-level', label: 'Lake surface (average water level)', value: '69.5 m above sea level', status: 'measured', source: MUNICIPALITY },
        { id: 'lakeaharju', label: 'Lakeaharju crater rim', value: 'about 100 m above the lake', status: 'measured', source: GEOPARK },
      ],
    },
  ],
};
