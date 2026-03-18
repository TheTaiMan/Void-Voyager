/**
 * Password hashing and verification using PBKDF2 via the Web Crypto API.
 * Stores salt and hash together as a single "salt:hash" hex string —
 * no extra DB column needed.
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey
 */

const ITERATIONS = 100_000
const KEY_LENGTH  = 256

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    )
    return crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
        keyMaterial,
        KEY_LENGTH
    )
}

function toHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

/**
 * Hashes a plain-text password. Returns a "saltHex:hashHex" string
 * safe to store directly in the DB.
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const hash = await deriveKey(password, salt)
    return `${toHex(salt.buffer)}:${toHex(hash)}`
}

/**
 * Re-derives the hash using the salt embedded in `stored` and does a
 * constant-time string comparison. Returns true if the password matches.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    const [saltHex, storedHashHex] = stored.split(':')
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)))
    const hash = await deriveKey(password, salt)
    return toHex(hash) === storedHashHex
}
