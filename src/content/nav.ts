/**
 * The floating pill nav. `id` doubles as the section anchor and the camera
 * location key, so adding a nav entry and registering a camera beat stay in
 * step.
 */

export interface NavItem {
  id: string;
  label: string;
}

export const navItems: readonly NavItem[] = [
  { id: 'platform', label: 'Platform' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Tools' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export const loaderCopy = {
  /** Reused from the previous site's preloader. */
  building: 'Building data platform',
  mark: 'PS',
  stages: [
    'Initializing world',
    'Building data platform',
    'Assembling pipeline',
    'Composing scenes',
    'Ready',
  ],
} as const;
