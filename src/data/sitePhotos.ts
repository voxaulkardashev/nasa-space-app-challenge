import type { SitePhoto } from './types';

/**
 * One NASA photo per featured site, chosen by hand from the NASA Image and
 * Video Library (search API: images-api.nasa.gov) on 14–15 November 2026.
 * Captions, dates, centres and credits are copied from NASA's records.
 * See docs/SOURCES.md.
 */

const asset = (nasaId: string, size: 'medium' | 'small' | 'thumb') =>
  `https://images-assets.nasa.gov/image/${nasaId}/${nasaId}~${size}.jpg`;

export const SITE_PHOTOS: Record<string, SitePhoto> = {
  'badwater-basin': {
    nasaId: 'PIA26197',
    caption: 'Badwater, Death Valley',
    date: '2023-12-14',
    center: 'JPL',
    credit: 'NASA/METI/AIST/Japan Space Systems, and U.S./Japan ASTER Science Team',
    imageUrl: asset('PIA26197', 'medium'),
  },
  'mcmurdo-dry-valleys': {
    nasaId: 'PIA12461',
    caption: 'Dry Valleys, Antarctica',
    date: '2009-11-02',
    center: 'JPL',
    credit: 'NASA/GSFC/METI/ERSDAC/JAROS, and U.S./Japan ASTER Science Team',
    imageUrl: asset('PIA12461', 'medium'),
  },
  holuhraun: {
    nasaId: 'jsc2024e055198',
    caption: 'Artemis II Crew geology training in Iceland - jsc2024e055198',
    date: '2024-08-01',
    center: 'JSC',
    credit: 'Robert Markowitz, NASA-JSC',
    imageUrl: asset('jsc2024e055198', 'medium'),
  },
  jezero: {
    nasaId: 'PIA23239',
    caption: "Jezero Crater, Mars 2020's Landing Site",
    date: '2019-05-15',
    center: 'JPL',
    credit: 'NASA/JPL-Caltech/MSSS/JHU-APL',
    imageUrl: asset('PIA23239', 'medium'),
  },
  gale: {
    nasaId: 'PIA15292',
    caption: 'Mount Sharp Inside Gale Crater, Mars',
    date: '2012-03-28',
    center: 'JPL',
    credit: 'NASA/JPL-Caltech/ESA/DLR/FU Berlin/MSSS',
    imageUrl: asset('PIA15292', 'medium'),
  },
};
