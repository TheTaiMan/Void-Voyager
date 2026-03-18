import { PGlite } from '@electric-sql/pglite';
import ddl from '../../create-table.sql?raw';

let src = 'idb://2452-emon';
if (import.meta.env && import.meta.env.MODE === 'test') {
    src = 'memory://';
}

console.log(`Using ${src} for database URL`);
const pgliteDb = await PGlite.create(src);

if (src === 'memory://') {
    // we're going to load the DDL here, we're doing tests.
    await pgliteDb.exec(ddl);
}

export default function db() {
  return pgliteDb;
}
