/**
 * Shared data types for the Planetary Analogue Explorer.
 *
 * Scientific integrity rule: every value shown in the interface must be
 * Measured, Estimated or Placeholder. The DataValue type below makes that
 * impossible to forget: TypeScript will refuse a Measured value without a
 * source, an Estimated value without a method, or a Placeholder without a reason.
 */

export type WorldId = 'moon' | 'mars' | 'earth';

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
  /** Longitude (degrees east) facing the viewer when the body first appears. */
  initialLongitudeDeg: number;
  /** Colour for the hover / selection highlight (CSS colour). */
  highlightColor: string;
  facts: DataValue[];
}
