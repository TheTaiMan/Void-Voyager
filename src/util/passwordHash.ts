const ITERATIONS = 100_000
const KEY_LENGTH = 256

// Derive initial key material from a password string
function getKeyMaterial(password: string) {
    const enc = new TextEncoder()
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    )
}

// Convert an ArrayBuffer to a hex string
function toHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

// Hash a password using PBKDF2 with a random salt
export async function hashPassword(password: string): Promise<string> {
    const keyMaterial = await getKeyMaterial(password)
    const salt = window.crypto.getRandomValues(new Uint8Array(16))

    const derivedBits = await window.crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
        keyMaterial,
        KEY_LENGTH
    )

    return `${toHex(salt.buffer as ArrayBuffer)}:${toHex(derivedBits)}`
}

// Verify a password against a stored hash string
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    const [saltHex, storedHashHex] = stored.split(':')

    const keyMaterial = await getKeyMaterial(password)
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)))

    const derivedBits = await window.crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
        keyMaterial,
        KEY_LENGTH
    )

    return toHex(derivedBits) === storedHashHex
}
