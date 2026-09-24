import * as migration_20260924_014027_ilk_kurulum from './20260924_014027_ilk_kurulum';

export const migrations = [
  {
    up: migration_20260924_014027_ilk_kurulum.up,
    down: migration_20260924_014027_ilk_kurulum.down,
    name: '20260924_014027_ilk_kurulum'
  },
];
