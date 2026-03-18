import { PGlite } from '@electric-sql/pglite';
import ddl from '../../create-table.sql?raw';

let src = 'idb://2452-emon';
if (import.meta.env && import.meta.env.MODE === 'test') {
    src = 'memory://';
}

console.log(`Using ${src} for database URL`);
const pgliteDb = await PGlite.create(src);

if (src === 'memory://') {
    await pgliteDb.exec(ddl);
}

// Returns PGlite database connection instance
export default function db() {
  return pgliteDb;
}
