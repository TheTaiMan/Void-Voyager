import { PGlite } from '@electric-sql/pglite';

// idb://2452-emon says to use IndexedDB as the backing storage for PGlite,
// this is "permanent" storage for us.
const pgliteDb = await PGlite.create('idb://2452-emon')

export default function db() {
  return pgliteDb;
}
