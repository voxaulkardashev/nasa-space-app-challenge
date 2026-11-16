import type { ResearchCitation, ResearchFigure, SiteResearch } from './siteResearch';
import type { SourceRef } from './types';

/**
 * Badwater Basin, California: the team's research for the Compare view's Earth column
 * (shown next to Gale). Text is the team's, with grammar edits, and corrected or trimmed
 * where the team's own sources say something different (see docs/SOURCES.md).
 * Source links are kept exactly as the team gave them.
 */

const ACCESSED = '16 November 2026';

const CITATIONS: ResearchCitation[] = [
  { n: 1, title: 'National Park Service — Badwater Basin (last updated 7 Jan 2026)', url: 'https://www.nps.gov/places/badwater-basin.htm' },
  {
    n: 2,
    title: 'National Park Service — Badwater Basin photo gallery',
    url: 'https://www.nps.gov/media/photo/gallery.htm?pg=5846958&id=F3AECF9F-155D-4519-3EAABFC85829E3CB',
  },
  { n: 3, title: 'National Park Service — Death Valley: Weather', url: 'https://www.nps.gov/deva/planyourvisit/weather.htm' },
  { n: 4, title: 'National Parks Conservation Association — Some Like It Very Hot (Spring 2018)', url: 'https://www.npca.org/articles/1767-some-like-it-very-hot' },
  { n: 5, title: 'National Park Service — Death Valley: Animals (last updated 20 Mar 2024)', url: 'https://www.nps.gov/deva/learn/nature/animals.htm' },
  {
    n: 6,
    title: 'NASA Jet Propulsion Laboratory — NASA’s Curiosity Mars Rover Starts Unpacking Boxwork Formations (23 Jun 2025)',
    url: 'https://www.jpl.nasa.gov/news/nasas-curiosity-mars-rover-starts-unpacking-boxwork-formations/',
  },
  { n: 7, title: 'U.S. Department of the Interior — Copyright, Restrictions, and Permissions', url: 'https://www.doi.gov/copyright' },
  { n: 8, title: 'NASA POWER — Hourly API', url: 'https://power.larc.nasa.gov/docs/services/api/temporal/hourly/' },
];

const NPS_BADWATER: SourceRef = {
  name: 'National Park Service — Badwater Basin',
  url: 'https://www.nps.gov/places/badwater-basin.htm',
  sourceDate: 'Last updated 7 January 2026',
  accessed: ACCESSED,
};

const GALLERY_URL = 'https://www.nps.gov/media/photo/gallery.htm?pg=5846958&id=F3AECF9F-155D-4519-3EAABFC85829E3CB';

/** NPS gallery photos: each is marked "Public domain" with photo credit "NPS" in the gallery's records. */
const npsPhoto = (src: string, title: string, caption: string, alt: string, height: number): ResearchFigure => ({
  src,
  alt,
  caption,
  credit: 'NPS (public domain)',
  sourceUrl: GALLERY_URL,
  sourceLabel: `NPS Badwater Basin photo gallery — “${title}”`,
  width: 1000,
  height,
});

export const BADWATER_RESEARCH: SiteResearch = {
  siteId: 'badwater-basin',
  citations: CITATIONS,
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      paragraphs: [
        'Badwater Basin is a basin within Death Valley National Park, California, United States of America. [[1]] It lies between mountain ranges, with the Black Mountains to the east and the Panamint Range to the west, and is known for its low elevation and its salt and mineral formations. [[1]]',
        'Much like the rest of Death Valley, Badwater Basin has extreme, changing temperatures and gusty winds; dust storms can blow up suddenly, and wind and rain keep reshaping the landscape. [[3]] [[2]]',
      ],
      facts: [
        {
          id: 'badwater-coords',
          label: 'Coordinates',
          value: '36.23° N, 116.77° W',
          status: 'estimated',
          method:
            'Approximate position of the Badwater pool and boardwalk, rounded to 0.01°, checked on NASA GIBS Landsat imagery and consistent with NASA’s ASTER scene of Badwater Basin centred at 36.3° N, 116.8° W (PIA26197). Not from an official gazetteer; the team should confirm it.',
          source: {
            name: 'NASA Photojournal PIA26197 — Badwater, Death Valley',
            url: 'https://science.nasa.gov/photojournal/badwater-death-valley/',
            sourceDate: '14 December 2023',
            accessed: ACCESSED,
          },
        },
      ],
      notes: ['Photos in this column are from the NPS Badwater Basin gallery, where each is marked public domain; the Department of the Interior asks that public-domain images be credited to their source (source 7).'],
      figure: npsPhoto(
        'images/badwater/salt-flat-uplift-nps.jpg',
        'Uplift on the salt flats',
        'As salt crystals grow over time, slabs of the salt crust are uplifted and eroded.',
        'A raised, broken slab of white salt crust on a flat salt plain, with a mountain range in the distance under a cloudy sky.',
        750,
      ),
    },
    {
      id: 'analog',
      title: 'Earth Analog Reasoning',
      paragraphs: [
        'Badwater Basin shares several characteristics with Gale Crater on Mars. In Gale, Curiosity found minerals left behind by groundwater, evidence of past water: groundwater trickling through cracks deposited minerals that hardened into ridges, along with salty minerals (magnesium sulfates and calcium sulfate veins) that form as water dries up. [[6]] At Badwater Basin, similar salt minerals are forming today, as groundwater rises through the salt deposits and evaporates. [[1]]',
        'The mountain ranges around the basin play a role similar to Gale’s crater rim and its central mountain: at Death Valley, heated air rises, is trapped by the high valley walls, and is cooled and recycled back down to the valley floor. [[3]] [[4]] Wind and dust erode rock in both places: at Badwater, wind and rain shape the salt and mud crust [[2]], and in Gale, eons of sandblasting by Martian wind wore away rock and revealed the mineral ridges. [[6]]',
        'On Mars this matters because Mars has no plate tectonics to lift up fresh rock, so wind erosion is one of the main ways older layers are exposed for scientists to study for signs of past life and geology.',
        'As for life, the spring-fed pool in Badwater Basin is home to organisms that thrive despite the very salty water. [[1]] Curiosity’s results show that Gale Crater held long-lived lakes too, but billions of years ago. [[6]]',
        'Differences matter as much as similarities: Badwater’s salts and life are active today, while Gale’s lakes dried up billions of years ago, and Earth cannot reproduce Mars’ low gravity, thin atmosphere or surface radiation (see below).',
      ],
    },
    {
      id: 'minerals',
      title: 'Mineral Composition',
      paragraphs: [
        'Badwater Basin’s salt flats cover nearly 200 square miles (518 km²) and are composed mostly of sodium chloride (table salt), along with calcite, gypsum and borax. [[1]]',
        'As groundwater rises up through the salt deposits and evaporates, geometric salt polygons form on the surface of the flats. [[1]] The water in the basin is very salty [[1]], and salt pools are lined with actively growing crystals. [[2]]',
      ],
      figure: npsPhoto(
        'images/badwater/salt-polygons-storm-nps.jpg',
        'Badwater Storm',
        'Surreal patterns of salt with a stormy backdrop: the geometric salt polygons of Badwater Basin.',
        'A flat white salt surface broken into many-sided polygons by raised salt ridges, under dark storm clouds with mountains on the horizon.',
        750,
      ),
    },
    {
      id: 'terrain',
      title: 'Terrain and Landforms',
      paragraphs: [
        'Badwater Basin is a wide, flat basin surrounded by high mountains: Death Valley is a long, narrow basin walled by high, steep mountain ranges. [[3]] [[1]] Its lowest part is below sea level. Springs feed the small Badwater pool near the boardwalk, and after heavy rain, water draining into the lowest part of the basin forms a temporary lake. [[1]] [[2]]',
        'The basin was once the site of the large ancient inland Lake Manly, which had no outlet and evaporated tens of thousands of years ago, leaving concentrated salt deposits behind. [[1]]',
        'The constant growth of salt crystals creates crusts, uplifted slabs, delicate crystals, geometric polygons and other formations. Wind and rain erode them, so the landscape keeps changing. [[2]] [[1]]',
      ],
      figure: npsPhoto(
        'images/badwater/lake-manly-temporary-nps.jpg',
        'Lake Manly',
        'Rainwater draining into the lowest part of the basin creates a temporary lake. (Boating is now prohibited on Lake Manly.)',
        'A shallow temporary lake stretching to a mountain range, seen from the bow of a blue kayak.',
        748,
      ),
    },
    {
      id: 'life',
      title: 'Current Life & Biosphere',
      paragraphs: [
        'Despite the salt and the harsh temperatures, many organisms not only survive but thrive at Badwater Basin. [[1]] Salt-tolerant plants such as pickleweed grow around the rim of the pool. [[1]]',
        'Pools of water are central to this life. The Badwater pool is fed by a spring [[1]], and rare rain can briefly fill the basin [[2]]. The pool is home to a snail that is endemic: it is naturally found only at this location. [[1]]',
        'Across Death Valley, a great diversity of wildlife survives extreme heat and drought through clever adaptations. [[5]]',
      ],
    },
    {
      id: 'weather',
      title: 'Climate/Temperature/Weather',
      paragraphs: [
        'Death Valley is famous as the hottest place on Earth and the driest place in North America. Summer temperatures often top 120 °F (49 °C) in the shade, and average rainfall is less than 2 inches (5 cm) a year. [[3]] Badwater’s wide, flat valley heats up so much because a belt of peaks cycles rising hot air back down to the valley floor, and it lies in the rain shadow of four mountain ranges. [[4]]',
        'Below are the newest weather values for Badwater Basin from NASA POWER, the same NASA service the website’s weather assistant uses for Earth. They load each time you open this view. [[8]]',
      ],
      liveEarth: {
        lat: 36.23,
        lon: -116.77,
        place: 'Badwater Basin, California',
        timeZone: 'America/Los_Angeles',
        liveLink: { label: 'NOAA’s Death Valley Weather & Climate page (linked by the NPS)', url: 'https://www.weather.gov/vef/RecDV' },
      },
    },
    {
      id: 'elevation',
      title: 'Elevation',
      paragraphs: [
        'Badwater Basin is the lowest point in North America, and so in the United States, at 282 feet (86 meters) below sea level. [[1]] Close by are high mountains, notably Telescope Peak in the Panamint Range to the west, at 11,049 feet (3,368 meters) above sea level: more than two miles above the basin. [[1]]',
      ],
      facts: [
        { id: 'badwater-elev', label: 'Elevation', value: '−86 m (282 ft below sea level)', status: 'measured', source: NPS_BADWATER },
        { id: 'telescope-peak', label: 'Telescope Peak (nearby)', value: '3,368 m (11,049 ft)', status: 'measured', source: NPS_BADWATER },
      ],
    },
  ],
};
