import type { SitePhoto } from './types';

/**
 * One NASA photo per featured site, chosen by hand from the NASA Image and
 * Video Library (search API: images-api.nasa.gov) on 14 November 2026.
 * Captions, dates, centres and credits are copied from NASA's records.
 * See docs/SOURCES.md.
 */

const asset = (nasaId: string, size: 'medium' | 'small') =>
  `https://images-assets.nasa.gov/image/${nasaId}/${nasaId}~${size}.jpg`;

export const SITE_PHOTOS: Record<string, SitePhoto> = {
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
  'olympus-mons': {
    nasaId: 'PIA00300',
    caption: 'Olympus Mons',
    date: '1998-06-04',
    center: 'JPL',
    credit: 'NASA/JPL/USGS',
    imageUrl: asset('PIA00300', 'medium'),
  },
  'valles-marineris': {
    nasaId: 'PIA00422',
    caption: 'Valles Marineris',
    date: '1998-06-08',
    center: 'JPL',
    credit: 'NASA/JPL/USGS',
    imageUrl: asset('PIA00422', 'medium'),
  },
  hellas: {
    nasaId: 'PIA00406',
    caption: 'Hellas Mosaic',
    date: '1998-06-08',
    center: 'JPL',
    credit: 'NASA/JPL/USGS',
    imageUrl: asset('PIA00406', 'medium'),
  },
  'meteor-crater': {
    nasaId: 'iss074e0208832',
    caption: 'Meteor Crater in Arizona',
    date: '2026-01-26',
    center: 'JSC',
    credit: 'NASA',
    imageUrl: asset('iss074e0208832', 'medium'),
  },
  haughton: {
    nasaId: 'ARC-2007-ACD09-0255-001',
    // NASA's title is only the ID, so this is the first sentence of NASA's description.
    caption: "K-10 Red driving near 'The Fortress' formation at Haughton Crater, Devon Island, Canada.",
    date: '2007-07-15',
    center: 'ARC',
    // From NASA's description: "photo credit NASA/Lorenzo Fluckiger".
    credit: 'NASA/Lorenzo Fluckiger',
    imageUrl: asset('ARC-2007-ACD09-0255-001', 'small'),
  },
};
