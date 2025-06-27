import { createHash, pbkdf2Sync, randomBytes } from 'crypto';

export type PswOptions = {
    p?: string;
    a: 'pbkdf2' | 'sha256';
};

/**
 * Generate a password hash for HAProxy, htpasswd, and general usage.
 */
export const psw = async (options: PswOptions) => {
    const { p, a } = options;
    if (!p) {
        throw new Error('Password is required. Use --p <password> to set it.');
    }

    let hashed: string;

    if (a === 'pbkdf2') {
        // PBKDF2 with SHA512 (recommended replacement for bcrypt)
        const salt = randomBytes(16).toString('hex');
        const hash = pbkdf2Sync(p, salt, 100000, 64, 'sha512').toString('hex');
        hashed = `${salt}$${hash}`;
    } else if (a === 'sha256') {
        // Simple SHA256 hash (not salted)
        hashed = createHash('sha256').update(p).digest('hex');
    } else {
        throw new Error(`Unsupported algorithm: ${a}`);
    }

    console.log(`[${a}] hashed password:`, hashed);
};