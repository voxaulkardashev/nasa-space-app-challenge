import { NSSDCA_EARTH, NSSDCA_MARS } from './sources';
import type { DataValue, SourceRef, WorldId } from './types';

/**
 * World Overview sidebar content: data that matters for planetary-analog work
 * (not just day length and gravity). Every value is labelled Measured /
 * Estimated with its source; findings scientists disagree about are marked
 * as debated (CLAUDE.md rule 6). See docs/SOURCES.md.
 */

export interface DatasetEntry {
  id: string;
  /** Dataset or instrument name as NASA gives it. */
  name: string;
  /** Mission / spacecraft it comes from. */
  mission: string;
  /** What it measures and why it matters for analog science. */
  what: string;
  /** Set when the interpretation of a result is debated (shown with a "Debated" tag). */
  debated?: string;
  source: SourceRef;
}

export interface AnalogOverview {
  /** Short intro line under the world name. */
  intro: string;
  conditions: DataValue[];
  datasets: DatasetEntry[];
}

const ACCESSED = '15 November 2026';
const page = (name: string, url: string, sourceDate = 'Page date not checked'): SourceRef => ({ name, url, sourceDate, accessed: ACCESSED });

const MAVEN_AURORAS = page(
  'NASA Science — NASA’s MAVEN Illuminates New Understanding of Auroras at Mars',
  'https://science.nasa.gov/missions/maven/nasas-maven-illuminates-new-understanding-of-auroras-at-mars/',
);
const ODYSSEY_INSTRUMENTS = page('NASA Science — Mars Odyssey Science Instruments', 'https://science.nasa.gov/mission/odyssey/science-instruments/');
const CURIOSITY_ORGANICS = page(
  'NASA Science — NASA’s Curiosity Rover Detects Largest Organic Molecules Found on Mars',
  'https://science.nasa.gov/missions/mars-science-laboratory/nasas-curiosity-rover-detects-largest-organic-molecules-found-on-mars/',
);
const SHERLOC_BRIGHT_ANGEL = page(
  'NASA Science — Perseverance’s SHERLOC Finds Organic Molecules in ‘Bright Angel’',
  'https://science.nasa.gov/photojournal/perseverances-sherloc-finds-organic-molecules-in-bright-angel/',
);
const CRISM_PAGE = page(
  'NASA Science — Spectrometer for Mars Reconnaissance Orbiter (CRISM)',
  'https://science.nasa.gov/resource/spectrometer-for-mars-reconnaissance-orbiter/',
  'June 19, 2006',
);
const MOLA_USGS = page(
  'USGS Astrogeology — Mars MGS MOLA DEM mosaic (global, 463 m)',
  'https://planetarymaps.usgs.gov/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif',
  'Date not stated in the file listing',
);
const GIBS_CAPS = page('NASA GIBS — WMTS capabilities (EPSG:4326, best)', 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml', 'Live service');
const ANALOG_EXPLORER = page('NASA Science — Planetary Analog Explorer', 'https://science.nasa.gov/solar-system/analog-explorer/', 'Page date not stated');
const SOLAR_WIND_MOON = page('NASA Science — Solar Wind on the Moon (on Earth’s magnetic field)', 'https://science.nasa.gov/moon/solar-wind/', 'Page date not stated');

export const ANALOG_OVERVIEW: Record<WorldId, AnalogOverview> = {
  mars: {
    intro: 'Conditions and NASA datasets that matter when comparing Mars with Earth analog sites.',
    conditions: [
      { id: 'atmosphere', label: 'Atmosphere (by volume)', value: '95.1% CO₂ · 2.59% N₂ · 1.94% Ar · 0.16% O₂', note: 'Oxygen is 0.16% (Earth: 20.95%)', status: 'measured', source: NSSDCA_MARS },
      { id: 'water-vapour', label: 'Water vapour in the air', value: '210 ppm', note: 'A minor gas, by volume', status: 'measured', source: NSSDCA_MARS },
      { id: 'pressure', label: 'Surface pressure', value: '6.36 mbar', note: 'At mean radius; varies 4.0–8.7 mbar with season', status: 'measured', source: NSSDCA_MARS },
      { id: 'temp-range', label: 'Daily temperature range', value: '184 K to 242 K (−89 to −31 °C)', note: 'Viking 1 Lander site', status: 'measured', source: NSSDCA_MARS },
      { id: 'winds', label: 'Wind speeds', value: '2–30 m/s', note: '2–7 m/s summer, 5–10 m/s fall, 17–30 m/s in dust storms (Viking Lander sites)', status: 'measured', source: NSSDCA_MARS },
      { id: 'ground-ice', label: 'Near-surface water ice', value: 'Up to ~50% by volume in places', note: 'In the upper metre of soil, in the areas marked on NASA’s hydrogen map', status: 'estimated', method: 'NASA: areas on the Mars Odyssey Gamma Ray Spectrometer hydrogen map “are believed to consist of 50% water ice by volume”; the neutron detectors sense hydrogen in the upper metre of the surface.', source: ODYSSEY_INSTRUMENTS },
      { id: 'topography', label: 'Topographic range', value: '30 km', note: 'Our MOLA grid (15 km cells) spans −8.0 to +21.1 km', status: 'measured', source: NSSDCA_MARS },
      { id: 'magnetic', label: 'Global magnetic field', value: 'None', note: 'Only small magnetised patches of crust (NASA)', status: 'measured', source: MAVEN_AURORAS },
    ],
    datasets: [
      { id: 'crism', name: 'CRISM (Compact Reconnaissance Imaging Spectrometer for Mars)', mission: 'Mars Reconnaissance Orbiter', what: 'Maps surface minerals from orbit, including the residue of minerals that form in water.', source: CRISM_PAGE },
      { id: 'grs', name: 'Gamma Ray Spectrometer & neutron detectors (GRS)', mission: 'Mars Odyssey', what: 'Maps elements such as hydrogen, silicon, iron and chlorine near the surface; hydrogen in the upper metre reveals buried water ice.', source: ODYSSEY_INSTRUMENTS },
      { id: 'themis', name: 'THEMIS (Thermal Emission Imaging System)', mission: 'Mars Odyssey', what: 'Infrared mineral mapping (carbonates, silicates, sulfates…) and 100 m images; also points to deposits tied to hydrothermal and subsurface water.', source: ODYSSEY_INSTRUMENTS },
      { id: 'sam', name: 'SAM (Sample Analysis at Mars)', mission: 'Curiosity rover, Gale crater', what: 'Found decane, undecane and dodecane — the largest organic molecules seen on Mars — in the “Cumberland” mudstone from an ancient lake.', debated: 'NASA: “there’s no way to confirm the source” — fatty acids can be made by living things or by geological processes.', source: CURIOSITY_ORGANICS },
      { id: 'sherloc', name: 'SHERLOC (Raman & luminescence for organics and chemicals)', mission: 'Perseverance rover, Jezero crater', what: 'Detected organic molecules in the “Bright Angel” rocks; one target, “Cheyava Falls”, contained a potential biosignature.', debated: 'NASA: these organic molecules “can be created by both geological as well as biological sources.”', source: SHERLOC_BRIGHT_ANGEL },
      { id: 'mola', name: 'MOLA elevation (Mars Orbiter Laser Altimeter)', mission: 'Mars Global Surveyor', what: 'Global heights used in this app for elevation and slope at any site.', source: MOLA_USGS },
    ],
  },
  earth: {
    intro: 'Conditions and NASA datasets that make Earth sites useful analogs — and where they differ from Mars.',
    conditions: [
      { id: 'atmosphere', label: 'Atmosphere (dry air, by volume)', value: '78.08% N₂ · 20.95% O₂ · 9,340 ppm Ar · 420 ppm CO₂', note: 'Mars’s air is 95.1% CO₂', status: 'measured', source: NSSDCA_EARTH },
      { id: 'water-vapour', label: 'Water vapour in the air', value: 'About 1% (highly variable)', note: 'Mars: 210 ppm', status: 'measured', source: NSSDCA_EARTH },
      { id: 'pressure', label: 'Surface pressure', value: '1014 mbar', note: 'About 160 times Mars’s 6.36 mbar (calculated)', status: 'measured', source: NSSDCA_EARTH },
      { id: 'temp-range', label: 'Daily temperature range', value: '283 K to 293 K (10 to 20 °C)', note: 'As listed on the fact sheet', status: 'measured', source: NSSDCA_EARTH },
      { id: 'winds', label: 'Wind speeds', value: '0 to 100 m/s', status: 'measured', source: NSSDCA_EARTH },
      { id: 'topography', label: 'Topographic range', value: '20.4 km', note: 'Mars: 30 km', status: 'measured', source: NSSDCA_EARTH },
      { id: 'magnetic', label: 'Global magnetic field', value: '0.24–0.66 gauss at the surface', note: 'NASA: it “helps to shield us from the harsh conditions of space”', status: 'measured', source: NSSDCA_EARTH },
    ],
    datasets: [
      { id: 'weld', name: 'Landsat WELD true colour, global annual composite (v3.1)', mission: 'Landsat, via NASA GIBS', what: 'About 30 m per pixel imagery of analog landscapes; used for the closest Earth views in this app.', source: GIBS_CAPS },
      { id: 'elevation', name: 'SRTM and ASTER GDEM elevation layers', mission: 'Shuttle Radar Topography Mission; Terra (ASTER), via NASA GIBS', what: 'Terrain models for analog sites — the Earth counterpart to MOLA on Mars. Available in GIBS; not yet used in this app.', source: GIBS_CAPS },
      { id: 'bluemarble', name: 'Blue Marble: Next Generation', mission: 'MODIS, via NASA Earth Observatory / GIBS', what: 'Cloud-free global imagery used for the Earth globe.', source: GIBS_CAPS },
      { id: 'field', name: 'Astrobiology field studies at analog sites', mission: 'NASA Planetary Analog Explorer', what: 'Portable instruments in the Atacama detect tiny amounts of target molecules in soil; Lake Salda sediments and Pilot Valley salts help scientists know what signs of life to look for on Mars.', source: ANALOG_EXPLORER },
      { id: 'shielding', name: 'Why Earth is shielded', mission: 'NASA Science', what: 'NASA: Earth has two layers of protection the Moon lacks — an atmosphere and a global magnetic field. Mars has a far thinner atmosphere and no global magnetic field.', source: SOLAR_WIND_MOON },
    ],
  },
};
