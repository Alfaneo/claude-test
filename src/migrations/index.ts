import * as migration_20260924_014027_ilk_kurulum from './20260924_014027_ilk_kurulum';
import * as migration_20260924_032315_gorsel_depolama_alanlari from './20260924_032315_gorsel_depolama_alanlari';
import * as migration_20260924_041655_paylasim_gorsel_boyutu from './20260924_041655_paylasim_gorsel_boyutu';
import * as migration_20260924_042615_seo_alanlari from './20260924_042615_seo_alanlari';

export const migrations = [
  {
    up: migration_20260924_014027_ilk_kurulum.up,
    down: migration_20260924_014027_ilk_kurulum.down,
    name: '20260924_014027_ilk_kurulum',
  },
  {
    up: migration_20260924_032315_gorsel_depolama_alanlari.up,
    down: migration_20260924_032315_gorsel_depolama_alanlari.down,
    name: '20260924_032315_gorsel_depolama_alanlari',
  },
  {
    up: migration_20260924_041655_paylasim_gorsel_boyutu.up,
    down: migration_20260924_041655_paylasim_gorsel_boyutu.down,
    name: '20260924_041655_paylasim_gorsel_boyutu',
  },
  {
    up: migration_20260924_042615_seo_alanlari.up,
    down: migration_20260924_042615_seo_alanlari.down,
    name: '20260924_042615_seo_alanlari'
  },
];
