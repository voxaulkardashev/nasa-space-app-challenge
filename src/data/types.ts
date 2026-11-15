/**
 * Shared data types for the Planetary Analogue Explorer.
 *
 * Scientific integrity rule: every value shown in the interface must be
 * Measured, Estimated or Placeholder. The DataValue type below makes that
 * impossible to forget: TypeScript will refuse a Measured value without a
 * source, an Estimated value without a method, or a Placeholder without a reason.
 */

export type WorldId = 'mars' | 'earth';

export type DataStatus = 'measured' | 'estimated' | 'placeholder';

/** Where a value or image came from. Also listed in docs/SOURCES.md. */
export interface SourceRef {
  /** Human-readable name, e.g. "NASA NSSDCA Mars Fact Sheet". */
  name: string;
  url: string;
  /** When the source itself was published or last updated. */
  sourceDate: string;
  /** When the team downloaded or read it. */
  accessed: string;
}

interface DataValueBase {
  /** Stable key, e.g. "gravity". */
  id: string;
  /** Label shown to the user, e.g. "Surface gravity". */
  label: string;
  /** Value exactly as shown, including units, e.g. "3.73 m/s²". */
  value: string;
  /** Optional short context, e.g. "Varies with season". */
  note?: string;
}

export interface MeasuredValue extends DataValueBase {
  status: 'measured';
  source: SourceRef;
}

export interface EstimatedValue extends DataValueBase {
  status: 'estimated';
  /** How the estimate was made. */
  method: string;
  source?: SourceRef;
}

export interface PlaceholderValue extends DataValueBase {
  status: 'placeholder';
  /** Why there is no real value yet. */
  reason: string;
}

export type DataValue = MeasuredValue | EstimatedValue | PlaceholderValue;

/** One image used on a 3D body, with where it came from and what we did to it. */
export interface ImageryCredit {
  /** What the image is used for, e.g. "Surface colour". */
  role: string;
  /** Dataset / product name as given by the source. */
  dataset: string;
  source: SourceRef;
  /** What we changed (resizing, format, contrast stretch...). */
  processing: string;
  /** Important caveats for viewers, e.g. "colours are approximate". */
  caveat?: string;
}

export interface WorldTextures {
  /** Path inside public/, e.g. "textures/mars/mars_color.jpg". */
  color: string;
  /** Optional grayscale elevation map, used only as a visual bump map. */
  elevation?: string;
  /** Strength of the bump-map shading. Visual only; not a measurement. */
  bumpScale: number;
}

export interface World {
  id: WorldId;
  name: string;
  /** One-line description shown under the name. */
  tagline: string;
  textures: WorldTextures;
  imagery: ImageryCredit[];
  /** Volumetric mean radius in km (same value and source as the "radius" fact). Used for distance maths. */
  meanRadiusKm: number;
  /** Longitude (degrees east) facing the viewer when the body first appears. */
  initialLongitudeDeg: number;
  /** Colour for the hover / selection highlight (CSS colour). */
  highlightColor: string;
  facts: DataValue[];
  /**
   * Optional text boxes for the World Overview sidebar, each with a title.
   * To add another box, add one more entry here; the panel shows them in order.
   */
  infoSections?: InfoSection[];
}

/** A titled box of descriptive text in the World Overview sidebar (written by the team). */
export interface InfoSection {
  id: string;
  title: string;
  body: string;
}

/** A named place the user can jump to on the Explore screen. */
export interface FeaturedSite {
  id: string;
  worldId: WorldId;
  name: string;
  /** Short category, e.g. "Crater" or "Apollo landing site". */
  kind: string;
  /** Degrees north. */
  lat: number;
  /** Degrees east, −180 to +180. */
  lon: number;
  /** One or two plain sentences of context. */
  description: string;
  /** How trustworthy the coordinates are: from an official record, or compiled/approximate. */
  coordinateStatus: 'measured' | 'estimated';
  coordinateSource: SourceRef;
  /** Explanation shown for estimated coordinates. */
  coordinateMethod?: string;
  /** Extra labelled values, e.g. the official diameter. */
  facts: DataValue[];
  /** Geological layers this site belongs to (our grouping, based on the cited descriptions). */
  layers: GeoLayerId[];
}

/** The geological filter layers on the Explore screen. */
export type GeoLayerId = 'impact' | 'aeolian' | 'sediments' | 'terrain';

/**
 * An Earth site that NASA describes as an analogue for a Mars site (or for
 * Mars in general). Similarities and differences are taken from the cited
 * NASA text; nothing here claims the two places are equivalent.
 */
export interface AnaloguePair {
  id: string;
  earthSiteId: string;
  /** The Mars featured site, or null when NASA compares the Earth site with Mars in general. */
  marsSiteId: string | null;
  /** NASA's own title for the pair, if any. */
  title: string;
  similarities: string[];
  /** Site-specific differences stated in the source (world-level differences are always shown separately). */
  differences: string[];
  source: SourceRef;
}

/** A photo from the NASA Image and Video Library (images.nasa.gov). */
export interface SitePhoto {
  /** NASA's identifier, used for the link back to the NASA page. */
  nasaId: string;
  /** NASA's own wording: the title, or the first sentence of the description when the title is only an ID. */
  caption: string;
  /** date_created from NASA's record (YYYY-MM-DD). */
  date: string;
  /** NASA centre that holds the record, e.g. "JPL". */
  center: string;
  /** Credit as given by NASA. "NASA" when the record lists no individual credit. */
  credit: string;
  /** Direct image file on images-assets.nasa.gov. */
  imageUrl: string;
}
