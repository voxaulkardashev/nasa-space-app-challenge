import type { SiteResearch } from './siteResearch';

/**
 * Team research for Jezero crater, shown in the Compare view's Mars column.
 * Text is the team's research, edited for clarity and accuracy and checked
 * against each cited source (see docs/SOURCES.md). "[[n]]" marks citation n.
 */

const ACCESSED = '15 November 2026';

export const JEZERO_RESEARCH: SiteResearch = {
  siteId: 'jezero',
  citations: [
    { n: 1, title: 'Bykov et al., “In Situ Detection of Opal-A in Jezero Crater, Mars”, JGR Planets (2026)', url: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2025JE009375' },
    { n: 2, title: 'McNeil et al., “Hydrated Silica in Oxia Planum, Mars”, JGR Planets (2025) — on opal (SiO₂·nH₂O) and why it matters for habitability', url: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2025JE008989' },
    { n: 3, title: 'NASA JPL — NASA’s Perseverance Rover Deciphers Ancient History of Martian Lake (12 Dec 2023)', url: 'https://www.jpl.nasa.gov/news/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/' },
    { n: 4, title: 'NASA JPL — NASA’s Perseverance Makes New Discoveries in Mars’ Jezero Crater (25 Aug 2022)', url: 'https://www.jpl.nasa.gov/news/nasas-perseverance-makes-new-discoveries-in-mars-jezero-crater/' },
    { n: 5, title: 'Farley et al., “Aqueously altered igneous rocks sampled on the floor of Jezero crater, Mars”, Science (2022)', url: 'https://doi.org/10.1126/science.abo2196' },
    { n: 6, title: 'Liu et al., “An olivine cumulate outcrop on the floor of Jezero crater, Mars”, Science (2022)', url: 'https://doi.org/10.1126/science.abo2756' },
    { n: 7, title: 'NASA Science Photojournal — Perseverance Views ‘Pico Turquino Hills’ (PIA26473, 12 Dec 2024)', url: 'https://science.nasa.gov/photojournal/perseverance-views-pico-turquino-hills/' },
    { n: 8, title: 'Goudge et al., “Stratigraphy and Evolution of Delta Channel Deposits, Jezero Crater, Mars”, Lunar and Planetary Science XLVIII, abstract 1195 (2017)', url: 'https://www.hou.usra.edu/meetings/lpsc2017/pdf/1195.pdf' },
    { n: 9, title: 'IAU/USGS Gazetteer of Planetary Nomenclature — Jezero (feature 14300)', url: 'https://planetarynames.wr.usgs.gov/Feature/14300' },
    { n: 10, title: 'NASA Science — Perseverance’s First 2 Regolith Samples (PIA25589, 7 Dec 2022)', url: 'https://science.nasa.gov/resource/perseverances-first-2-regolith-samples/' },
    { n: 11, title: 'Bell et al., “Geological, multispectral, and meteorological imaging results from the Mars 2020 Perseverance rover in Jezero crater”, Science Advances (2022)', url: 'https://doi.org/10.1126/sciadv.abo4856' },
    { n: 12, title: 'Murphy et al., “Spatially distributed complex organic matter detected in an ancient river valley in Jezero crater, Mars”, Science Advances (2026)', url: 'https://www.science.org/doi/10.1126/sciadv.adx0047?referrer=https%3A%2F%2Fwww.google.com%2F' },
    { n: 13, title: 'NASA Goddard Planetary Spectrum Generator — Mars Explorer app', url: 'https://psg.gsfc.nasa.gov/apps/mars/' },
    { n: 14, title: 'NASA Science Photojournal — Jezero Crater Elevation Graph (PIA26476, 12 Dec 2024)', url: 'https://science.nasa.gov/photojournal/jezero-crater-elevation-graph/' },
  ],
  otherCredits: [
    { title: 'Bykov et al. (2026), JGR Planets — In Situ Detection of Opal-A in Jezero Crater, Mars', url: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2025JE009375' },
    { title: 'McNeil et al. (2025), JGR Planets — Hydrated Silica in Oxia Planum, Mars', url: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2025JE008989' },
    { title: 'Murphy et al. (2026), Science Advances — Spatially distributed complex organic matter detected in an ancient river valley in Jezero crater, Mars', url: 'https://www.science.org/doi/10.1126/sciadv.adx0047?referrer=https%3A%2F%2Fwww.google.com%2F' },
    { title: 'NASA JPL — NASA’s Perseverance Rover Deciphers Ancient History of Martian Lake', url: 'https://www.jpl.nasa.gov/news/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/' },
  ],
  sections: [
    {
      id: 'minerals',
      title: 'Mineral Composition',
      paragraphs: [
        'NASA’s Perseverance rover found hydrated silica, including opal, in Jezero Crater: its SHERLOC and PIXL instruments identified opal-A in a rock patch nicknamed “Bills Bay”, between the crater rim and the western delta. [[1]]',
        'Water is a main component of opal, whose chemical formula is SiO₂·nH₂O. Because opal forms in many watery environments and is good at preserving signs of life, finding it on Mars implies that water was once present, and helps scientists investigate whether Mars was habitable. [[2]] Jezero itself once held a lake fed by a river, a potentially habitable environment. [[3]]',
        'Besides hydrated silica such as opal, Jezero contains igneous (volcanic) rock. The crater floor is made of two kinds of igneous rock: one formed from magma deep underground, the other from volcanic activity at the surface. [[4]] Rocks higher up, on the crater rim, are mostly made of volcanic minerals such as olivine, plagioclase and pyroxene [[7]]; plagioclase is a feldspar, the most common mineral group in Earth’s crust.',
        'The lowest exposed rock layer on the crater floor, nicknamed Séítah, is rich in olivine. It accumulated at the base of a body of magma as olivine crystals settled out while the magma slowly cooled, [[5]] [[6]] which explains its large olivine grains (1 to 3 millimeters). [[4]] These rocks are mainly made of coarse-grained olivine, similar to some Martian meteorites. [[6]]',
      ],
      figure: {
        src: 'images/jezero/bills-bay-pixl-pia26205.jpg',
        alt: 'Close-up of the abraded rock surface “Bills Bay”, showing light and dark mineral grains.',
        caption:
          'The abraded rock patch “Bills Bay”, imaged by PIXL’s camera on 7 and 11 October 2023, with colour added from SHERLOC’s WATSON cameras. Opal-A was later identified in this patch. [1]',
        credit: 'NASA/JPL-Caltech/MSSS',
        sourceUrl: 'https://images.nasa.gov/details/PIA26205',
        sourceLabel: 'PIXL Instrument on NASA’s Perseverance Studies ‘Bills Bay’ (PIA26205)',
        width: 1100,
        height: 825,
      },
    },
    {
      id: 'terrain',
      title: 'Terrain and Landforms',
      paragraphs: [
        'Jezero is an impact crater that once hosted an open-basin lake. At the mouth of its western inlet valley is a well-exposed delta deposit, built by river channels that carried water and sediment into the lake. [[8]]',
        'At its largest, the lake that filled Jezero is thought to have been as wide as 22 miles (35 kilometers) and as deep as about 100 feet (30 meters). [[3]] The crater itself is about 47.5 kilometers across. [[9]]',
        'Water arrived in stages: sandstone and mudstone record the arrival of the first river; salt-rich mudstones above them record a shallow lake that was evaporating; the lake then grew; and later, fast-flowing water carried boulders from outside the crater onto the delta. [[3]]',
      ],
      facts: [
        {
          id: 'jezero-lake',
          label: 'Ancient lake at its largest',
          value: 'about 35 km wide, 30 m deep',
          status: 'estimated',
          method: 'The Mars 2020 team’s reconstruction of the lake from the rocks Perseverance studied, as reported by NASA JPL (“The team thinks the lake eventually grew as wide as 22 miles (35 kilometers) in diameter and as deep as 100 feet (30 meters)”).',
          source: { name: 'NASA JPL — Perseverance Rover Deciphers Ancient History of Martian Lake', url: 'https://www.jpl.nasa.gov/news/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/', sourceDate: '12 December 2023', accessed: ACCESSED },
        },
        {
          id: 'jezero-diameter',
          label: 'Crater diameter',
          value: '47.52 km',
          status: 'measured',
          source: { name: 'IAU/USGS Gazetteer of Planetary Nomenclature — Jezero (feature 14300)', url: 'https://planetarynames.wr.usgs.gov/Feature/14300', sourceDate: 'Feature record last updated Nov 17, 2010', accessed: '14 November 2026' },
        },
      ],
      figure: {
        src: 'images/jezero/jezero-delta-themis-pia26252.jpg',
        alt: 'Grayscale orbital image of Jezero crater; the fan-shaped delta deposit is on the left.',
        caption:
          'Jezero’s delta deposit (left side of the image), seen by the THEMIS visible camera on NASA’s Mars Odyssey orbiter on 19 May 2023. The delta was created by flow from the rim channel into the crater.',
        credit: 'NASA/JPL-Caltech/ASU',
        sourceUrl: 'https://images.nasa.gov/details/PIA26252',
        sourceLabel: 'Jezero Crater Delta (PIA26252)',
        width: 707,
        height: 1435,
      },
    },
    {
      id: 'soil',
      title: 'Soil Properties',
      paragraphs: [
        'Perseverance collected its first two samples of regolith (broken rock and dust, the Martian equivalent of soil) in Jezero on 2 and 6 December 2022, from a “mega-ripple”: a pile of sand and dust similar to, but smaller than, a dune. [[10]]',
        'Images from the rover’s Mastcam-Z cameras show that pyroxene dominates the iron-bearing minerals in Jezero’s fine-grained regolith, while olivine dominates the coarse-grained regolith. [[11]]',
        'Studying regolith with laboratory equipment on Earth would help scientists understand the processes that shaped the surface of Mars, and help engineers design equipment for future astronauts. [[10]]',
      ],
      figure: {
        src: 'images/jezero/regolith-samples-pia25589.jpg',
        alt: 'Two navigation-camera views of Perseverance’s robotic arm over two small holes in sandy ground.',
        caption: 'Perseverance’s robotic arm over the two holes left after collecting its first regolith samples, seen by the left navigation camera (December 2022).',
        credit: 'NASA/JPL-Caltech',
        sourceUrl: 'https://science.nasa.gov/resource/perseverances-first-2-regolith-samples/',
        sourceLabel: 'Perseverance’s First 2 Regolith Samples (PIA25589)',
        width: 1200,
        height: 900,
      },
    },
    {
      id: 'past-life',
      title: 'Signs of Past Life',
      paragraphs: [
        'The hydrated silica (opal) found in Jezero shows that the crater once had water, an important component for sustaining life, [[1]] [[2]] and silica is very good at preserving organic molecules, including those related to life. [[3]]',
        'Perseverance has also detected complex organic carbon in mudstones in an ancient river valley inside Jezero, its most robust organic detection in the crater so far. [[12]] Organic (carbon-based) molecules make up the proteins, carbohydrates, lipids and nucleic acids that all known life depends on, but they can also form through geological processes without life. [[3]]',
        'These findings are evidence that Jezero was potentially habitable, not proof that life existed there. The rover’s measurements cannot tell whether the organic matter came from living or non-living sources, [[12]] and as of December 2023 Perseverance had not seen fossil-like structures or chemical changes left by ancient microbes. [[3]] Studying the rover’s samples with laboratory equipment on Earth would be needed to look further. [[3]]',
      ],
    },
    {
      id: 'weather',
      title: 'Temperature/Weather',
      paragraphs: [
        'These values are a prediction based on past data, not live weather measurements. They come from NASA Goddard’s Planetary Spectrum Generator (PSG) Mars Explorer, loaded each time you open this view, for Jezero Crater (18.41° N, 77.69° E) and the current time. PSG builds them from EMARS model data for the past Mars year most similar to now (it reports Mars Year 32, 2013–2015), at today’s season and time of day. No spacecraft reports live weather for Jezero in this source. [[13]]',
      ],
      live: { lat: 18.41, lon: 77.69, place: 'Jezero Crater (18.41° N, 77.69° E)' },
      notes: [
        'Limitations: these are model values for a large area around Jezero, so they smooth out the crater and its delta, and can differ from what Perseverance measures on the ground. The model’s ground height for this spot is shown above. The app itself says it is “undergoing active development” and “should be only used for testing purposes”.',
      ],
    },
    {
      id: 'elevation',
      title: 'Elevation',
      paragraphs: [
        'This NASA graph shows the elevation, in meters, of places Perseverance visited in and around Jezero Crater, against the mission day (sol). Coloured dots are targets studied by the rover’s SuperCam laser, coloured by region (labelled on the graph); black diamonds are spots where the rover abraded rocks to study their composition. [[14]]',
        'Jezero sits about 2,600 meters (8,530 feet) below Mars’s reference level (its equivalent of “sea level”), which is why the elevations are negative. [[14]] Reading the graph: the crater-floor regions Máaz and Séítah are lowest, at about −2,570 to −2,580 m; the rover then climbed onto the Fan Front (about −2,520 to −2,545 m) and the Upper Fan (about −2,420 m), crossed the Margin and Neretva areas (about −2,400 to −2,350 m), and finally climbed steeply up the crater Rim to about −1,990 m by about sol 1,340. The dashed horizontal lines mark estimated levels of ancient, now-dry lakes. [[14]]',
      ],
      facts: [
        {
          id: 'jezero-below-datum',
          label: 'Jezero below Mars reference level',
          value: 'about 2,600 m (8,530 ft)',
          status: 'measured',
          source: { name: 'NASA Science Photojournal — Jezero Crater Elevation Graph (PIA26476)', url: 'https://science.nasa.gov/photojournal/jezero-crater-elevation-graph/', sourceDate: '12 December 2024', accessed: ACCESSED },
        },
        {
          id: 'jezero-climb',
          label: 'Climb shown on the graph',
          value: 'about 590 m (−2,580 m to −1,990 m)',
          status: 'estimated',
          method: 'Read by eye from NASA’s graph PIA26476: the lowest points (Máaz/Séítah, about −2,580 m) to the highest point on the rim (about −1,990 m). Approximate.',
          source: { name: 'NASA Science Photojournal — Jezero Crater Elevation Graph (PIA26476)', url: 'https://science.nasa.gov/photojournal/jezero-crater-elevation-graph/', sourceDate: '12 December 2024', accessed: ACCESSED },
        },
      ],
      figure: {
        src: 'images/jezero/jezero-elevation-graph-pia26476.jpg',
        alt: 'Line graph of elevation (meters, from −2,600 to −2,000) against sol (0 to about 1,340), with regions labelled Maaz, Seitah, Fan Front, Upper Fan, Margin, Neretva and Rim, and dashed lines for estimated ancient lake levels.',
        caption: 'Elevation of Perseverance’s sampling sites versus sol. Dots: SuperCam targets, coloured by region. Diamonds: analysis of abraded patches. Dashed lines: estimated ancient lake levels.',
        credit: 'NASA/JPL-Caltech/LANL/CNES/IRAP/DLR',
        sourceUrl: 'https://science.nasa.gov/photojournal/jezero-crater-elevation-graph/',
        sourceLabel: 'Jezero Crater Elevation Graph (PIA26476)',
        width: 1600,
        height: 902,
      },
    },
  ],
};
