import bcrypt from 'bcrypt';
import { createHash } from 'crypto';

export type PswOptions = {
    p?: string;
    a: 'bcrypt' | 'sha256';
};

/**
 * Generate a password hash for HAProxy, htpasswd, and general usage.
 */
export const cleanup = async (options: PswOptions) => {
    const { p, a } = options;
    if (!p) {
        throw new Error('Password is required. Use --p <password> to set it.');
    }

    let hashed: string;

    if (a === 'bcrypt') {
        // bcrypt (default 10 rounds)
        hashed = await bcrypt.hash(p, 10);
    } else if (a === 'sha256') {
        // fallback to SHA256
        const sha256 = createHash('sha256').update(p).digest('hex');
        hashed = sha256;
    } else {
        throw new Error(`Unsupported algorithm: ${a}`);
    }

    console.log(`[${a}] hashed password:`, hashed);
};
