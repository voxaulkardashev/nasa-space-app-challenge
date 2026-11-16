/**
 * Steps of the guided tour ("Take the tour"). Each step can move the app to a
 * screen first, then highlights the element(s) matching `target` with a short
 * explanation. Steps with no target (or whose target isn't on screen) show the
 * card in the middle. Text describes only features the app really has.
 */

export type TutorialStage =
  /** Landing page. */
  | 'select'
  /** Mars World Overview. */
  | 'overview'
  /** Explore Mars, no site chosen. */
  | 'explore'
  /** Explore Mars with Jezero chosen (so site details are on screen). */
  | 'explore-site';

export interface TutorialStep {
  id: string;
  stage: TutorialStage;
  title: string;
  body: string;
  /** CSS selector; every matching element is highlighted together. */
  target?: string;
  /** Highlight only the first matching element. */
  first?: boolean;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    stage: 'select',
    title: 'Welcome to Terralink',
    body: 'This short tour shows how to explore Mars and Earth on 3D globes made from NASA data, and how to compare Martian sites with places on Earth that scientists use as “analogues”. Use Next and Back, or the arrow keys. Press Skip (or Esc) at any time.',
  },
  {
    id: 'pick-world',
    stage: 'select',
    target: '.planet-label',
    title: 'Pick a world',
    body: 'Click Mars or Earth (or its name) to fly in. The tour will open Mars for you.',
  },
  {
    id: 'overview-panel',
    stage: 'overview',
    target: '.screen--overview .info-panel',
    title: 'What matters for analogue science',
    body: 'The sidebar lists the conditions that make Mars different from Earth (atmosphere, temperature, ice and more), the Earth analogue sites chosen by our team, and recent space weather. Drag its left edge to make it wider.',
  },
  {
    id: 'labels',
    stage: 'overview',
    target: '.screen--overview .info-panel .data-label',
    first: true,
    title: 'Every number has a label',
    body: 'Measured means it comes from a named dataset. Estimated means it was worked out with a stated method (for example a computer model). Placeholder means there is no real data yet. Tap a label to see its source.',
  },
  {
    id: 'view-modes',
    stage: 'overview',
    target: '.screen--overview .view-switch',
    title: 'Globe, 2D or Topography',
    body: 'Switch between the 3D globe, a flat 2D map, and Topography, which raises the surface using NASA height data (heights are exaggerated so you can see them). “Labels” turns place names on and off.',
  },
  {
    id: 'explore-button',
    stage: 'overview',
    target: '.explore-cta',
    title: 'Start exploring',
    body: 'The Explore button opens the main tool. Drag to rotate the globe and scroll or pinch to zoom; sharper NASA imagery loads as you get closer.',
  },
  {
    id: 'world-switch',
    stage: 'explore',
    target: '.world-switch-wrap',
    title: 'Switch between Mars and Earth',
    body: 'Jump between the two worlds at any time. Each world remembers the site you chose.',
  },
  {
    id: 'sites',
    stage: 'explore',
    target: '.screen--explore .featured-sites',
    title: 'Featured sites',
    body: 'Choose a featured site (like Jezero, where Perseverance landed) and the camera flies there. Sites also appear as pins on the globe; Geological layers (top left) filters them, and the search box finds sites on both worlds.',
  },
  {
    id: 'drop-pin',
    stage: 'explore',
    target: '.pin-toggle',
    title: 'Drop your own pin',
    body: 'Press Drop pin, then click anywhere on the globe to choose your own site. Esc cancels.',
  },
  {
    id: 'weather',
    stage: 'explore-site',
    target: '.screen--explore .weather .info-box__title, .screen--explore .weather .weather__controls',
    title: 'Weather assistant',
    body: 'For any site, see its weather from NASA. On Mars, “Right now on Mars” shows NASA’s current model estimate for that spot, and you can colour the whole globe by temperature, pressure, dust or wind. Pick a date and press Analyze to get Curiosity’s measurements, then ask the assistant questions.',
  },
  {
    id: 'counterpart',
    stage: 'explore-site',
    target: '.counterpart',
    title: 'Its analogue on the other world',
    body: 'When a site has an Earth analogue chosen by our team, it appears here. Click one to jump to it.',
  },
  {
    id: 'compare',
    stage: 'explore-site',
    target: '.site-panel__compare',
    title: 'Compare Mars and Earth',
    body: 'Compare shows the two sites side by side: our team’s research for each site with images, clickable sources and live weather, plus what Earth can never reproduce (gravity, thin air and radiation). Analogues share some features; they are never the same place.',
  },
  {
    id: 'topbar',
    stage: 'explore-site',
    target: '.explore-topbar',
    title: 'More tools',
    body: 'Side by side shows both globes at once. With a pin on each world, the weather assistant can also compare their weather. The ? Tour button replays this tour.',
  },
  {
    id: 'done',
    stage: 'explore-site',
    title: 'You’re ready',
    body: 'That’s the tour. You can take it again any time with the “?” Tour button, or “Take the tour” on the first page. Have fun exploring!',
  },
];

/** Remembers that this browser has seen (or dismissed) the first-visit tour offer. */
export const TUTORIAL_SEEN_KEY = 'pae-tour-seen';
