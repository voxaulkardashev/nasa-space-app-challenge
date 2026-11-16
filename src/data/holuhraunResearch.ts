import type { ResearchCitation, SiteResearch } from './siteResearch';

/**
 * Holuhraun, Iceland: the team's research for the Earth side of the Elysium Planitia
 * comparison (draft in docs/holuhraun-research.md). Text is the team's, edited for clarity;
 * statements checked against the cited sources, others listed as uncited in docs/SOURCES.md.
 */

const CITATIONS: ResearchCitation[] = [
  {
    n: 1,
    title:
      'Voigt, J. R. C. et al. (2025). The 2014–2015 Holuhraun Lava Flow-field in Iceland as a Planetary Analog for Young Volcanic Terrains in Elysium Planitia, Mars. The Planetary Science Journal 6, 81.',
    url: 'https://iopscience.iop.org/article/10.3847/PSJ/adb5f1',
  },
  {
    n: 2,
    title: 'Voigt, J. R. C. et al. (2021). Geomorphological characterization of the 2014–2015 Holuhraun lava flow-field in Iceland. Journal of Volcanology and Geothermal Research 419, 107278.',
    url: 'https://www.sciencedirect.com/science/article/pii/S0377027321001074',
  },
  {
    n: 3,
    title: 'Geiger, H. et al. (2016). Magma plumbing for the 2014–2015 Holuhraun eruption, Iceland. Geochemistry, Geophysics, Geosystems 17, 2953–2968.',
    url: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1002/2016GC006317',
  },
  {
    n: 4,
    title:
      'Duhamel, S. et al. (2022). Microbial Response to Increased Temperatures Within a Lava-Induced Hydrothermal System in Iceland: An Analogue for the Habitability of Volcanic Terrains on Mars. Astrobiology 22, 1176–1198.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/35920884/',
  },
  {
    n: 5,
    title: 'Dundas, C. M. et al. (2020). Lava–water interaction and hydrothermal activity within the 2014–2015 Holuhraun Lava Flow Field, Iceland. Journal of Volcanology and Geothermal Research 408, 107100 (USGS record).',
    url: 'https://pubs.usgs.gov/publication/70217260',
  },
  { n: 6, title: 'NASA Earth Observatory — Roiling Flows on Holuhraun Lava Field (10 Sep 2014)', url: 'https://science.nasa.gov/earth/earth-observatory/roiling-flows-on-holuhraun-lava-field-84316/' },
  { n: 7, title: 'Wikimedia Commons — Category:Holuhraun', url: 'https://commons.wikimedia.org/wiki/Category:Holuhraun' },
  { n: 8, title: 'NASA POWER — Hourly API', url: 'https://power.larc.nasa.gov/docs/services/api/temporal/hourly/' },
  {
    n: 9,
    title: 'Pedersen, G. B. M. et al. (2017). Lava field evolution and emplacement dynamics of the 2014–2015 basaltic fissure eruption at Holuhraun, Iceland. Journal of Volcanology and Geothermal Research 340, 155–169.',
    url: 'https://doi.org/10.1016/j.jvolgeores.2017.02.027',
  },
  {
    n: 10,
    title: 'NASA Earth Observatory — Blue Marble: Next Generation, Topography and Bathymetry Maps (GEBCO data)',
    url: 'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/topography-bathymetry-maps/',
  },
];

export const HOLUHRAUN_RESEARCH: SiteResearch = {
  siteId: 'holuhraun',
  citations: CITATIONS,
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      paragraphs: [
        'Holuhraun is a large basaltic lava field in the Icelandic Highlands, between the Bárðarbunga and Askja volcanoes, north of the Vatnajökull ice cap. [[6]] Its 2014–2015 eruption was fed by magma from the Bárðarbunga volcanic system and erupted within the Askja fissure swarm. [[3]]',
        'The fissure-fed eruption ran from August 2014 to February 2015 and covered about 84 km² with basaltic lava, the largest effusive eruption in Iceland since the Laki eruption of 1783–1784. [[9]] This makes it a valuable place to study how such eruptions shape terrain, and how they can create warm, water-rich environments.',
        'As the lava spread across the floodplain, it flowed into a river system fed by glacial meltwater, creating a short-lived hydrothermal system. [[5]] Many volcanic landscapes are compared with Mars for their geology; Holuhraun can also be studied for its microbial communities and their value for astrobiology. [[4]]',
      ],
      figure: {
        src: 'images/holuhraun/holuhraun-landsat8-2014.jpg',
        alt: 'False-colour Landsat 8 image of the Holuhraun eruption: a bright orange lava flow and a pale blue plume between Askja volcano and the Vatnajökull ice cap.',
        caption:
          'The Holuhraun eruption on 6 September 2014, seen by the Operational Land Imager on Landsat 8 (false colour, OLI bands 6-5-3: ice and the gas plume appear cyan and blue, liquid water navy blue, fresh lava orange and red).',
        credit: 'NASA Earth Observatory image by Jesse Allen, using Landsat data from the U.S. Geological Survey',
        sourceUrl: 'https://science.nasa.gov/earth/earth-observatory/roiling-flows-on-holuhraun-lava-field-84316/',
        sourceLabel: 'NASA Earth Observatory — Roiling Flows on Holuhraun Lava Field (10 Sep 2014)',
        width: 720,
        height: 480,
      },
    },
    {
      id: 'analog',
      title: 'Earth Analog Reasoning',
      paragraphs: [
        'Scientists already use Holuhraun as an analog for Elysium Planitia’s young volcanic terrains: both have young fissure systems, fissure-fed lava flows, similar lava surface types and evidence of lava–water interaction. [[1]] Our team is especially interested in another aspect: whether lava meeting water could have created habitable hydrothermal environments on the Martian plains.',
        'During the 2014–2015 eruption, lava entered a glacial river system and heated the water, creating temporary hydrothermal pools and springs [[5]] where volcanic heat, liquid water and basaltic rock interacted and microbes lived. [[4]] Similar processes may have happened in Elysium Planitia when lava met subsurface water and ice.',
        'Holuhraun does not reproduce Mars’ thin atmosphere, its temperatures or its subsurface conditions, but it shows how volcanic activity can create temporary habitable niches.',
        'Studies have examined the living microbes in the lava-heated water while it was warm. [[4]] On Mars, scientists would instead search for biosignatures billions of years old. So our team proposes studying what happens after the hydrothermal system dies: how cooling and mineral precipitation in the now-cold outflow channels trap or destroy the molecules left by the heat-loving microbes. That would help answer an important question for Mars research: are short-lived, lava-heated hydrothermal systems enough to leave detectable biosignatures?',
      ],
    },
    {
      id: 'minerals',
      title: 'Mineral Composition',
      paragraphs: [
        'Holuhraun’s lava is mostly tholeiitic basalt, a common volcanic rock rich in iron and magnesium. Minerals identified in the 2014–2015 lava include plagioclase feldspar (containing calcium and sodium) and clinopyroxene [[3]], along with olivine and titanomagnetite; the fine-grained groundmass contains tiny crystals (microlites) of plagioclase, clinopyroxene, olivine and skeletal titanomagnetite.',
        'The lava also contains cavities (vesicles) left by gas escaping as it cooled and hardened. These cavities and fractures may matter for understanding how fluids move through the rock and where microbial communities could settle.',
        'Because both are basaltic, Holuhraun is useful for comparing water–rock interactions on Earth and in Elysium Planitia: hot water altering volcanic rock can release dissolved elements and create chemically varied environments that might support life.',
      ],
    },
    {
      id: 'terrain',
      title: 'Terrain and Landforms',
      paragraphs: [
        'Holuhraun is a broad, generally flat basaltic lava plain formed by fissure-fed eruptions. [[1]] The 2014–2015 eruption produced rubbly, slabby and spiny pāhoehoe (lava with broken, plate-like and spiny surfaces) as well as areas of rough, jagged lava made of broken, angular fragments, creating a landscape of fragmented crust, vesicles, fractures and irregular surfaces. [[2]] [[1]]',
        'The lava spread over a glacial outwash plain whose sand, gravel and river channels allowed lava and water to interact. [[5]]',
        'This setting could also let scientists test whether older sediments, landforms and biosignatures can survive underneath younger lava flows.',
      ],
    },
    {
      id: 'life',
      title: 'Current Life & Biosphere',
      paragraphs: [
        'When the fresh lava met glacial meltwater, volcanic heat created warmer water environments (hot pools, springs and streams), and these lava-heated waters were found to contain microbes. [[5]] [[4]]',
        'A study of the system in 2016 found that the microbial communities in the lava-heated water were very different from those in the glacial river and spring water that fed it, and some groups were found only in water coming out of the lava. [[4]]',
        'In field experiments, glacial river water kept in a lava-heated stream (17.5 °C) had more microbes, and more kinds of microbes, than water kept at the river’s own temperature (5.7 °C). Researchers also isolated heat-loving (thermophilic) bacteria from the lava-heated water and a nearby acidic hydrothermal system. [[4]]',
        'Intensive biological monitoring declined after these hydrothermal oases cooled. Our team proposes long-term monitoring of the formerly heated sites: tracking how microbial communities, organic molecules and biosignatures change, become entombed or decay after the heating stops would show whether short-lived volcanic heating on ancient Mars could have left biosignatures that are still detectable.',
      ],
    },
    {
      id: 'weather',
      title: 'Climate/Temperature/Weather',
      paragraphs: [
        'The lava-induced hydrothermal system warmed the local water as cold glacial meltwater and spring water seeped through porous, fractured basalt and emerged as warm springs, pools and seepage channels. [[5]] The team’s research reports water temperatures rising from about 6 °C to 48.4 °C about six months after the eruption, then falling back to normal roughly two years after it; these figures are water temperatures, not air temperatures, and were not confirmed in the source summaries we could read.',
        'Below are the newest weather values for Holuhraun from NASA POWER, the same NASA service the website uses for other Earth sites. They load each time you open this view. [[8]]',
      ],
      liveEarth: { lat: 64.874, lon: -16.74, place: 'Holuhraun, Iceland', timeZone: 'Atlantic/Reykjavik' },
    },
    {
      id: 'elevation',
      title: 'Elevation',
      paragraphs: [
        'The Holuhraun lava field lies at approximately 800 m above sea level: NASA’s Blue Marble topography gives about 785 m for the area around the marker. [[10]] Heights vary across the field because the lava surface is uneven and because of erosion and deposition.',
      ],
      facts: [
        {
          id: 'holuhraun-elevation',
          label: 'Elevation (area around the marker)',
          value: 'about 785 m',
          note: 'Average of a grid cell about 14 km × 6 km; heights in steps of about 25 m',
          status: 'measured',
          source: {
            name: 'NASA Earth Observatory — Blue Marble: Next Generation topography (GEBCO data), averaged to 8 cells per degree',
            url: 'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/topography-bathymetry-maps/',
            sourceDate: 'Original data: GEBCO 2008',
            accessed: '16 November 2026',
          },
        },
      ],
    },
  ],
};
