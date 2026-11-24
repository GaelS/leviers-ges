import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { Result, err, ok } from 'neverthrow';
import { violation } from "./violation.js";
const readBytes = Result.fromThrowable((path) => readFileSync(path), (error) => violation('unreadable', String(error)));
const decodeUtf8 = Result.fromThrowable((bytes) => new TextDecoder('utf-8', { fatal: true }).decode(bytes), (error) => violation('not_utf8', String(error)));
function verifyChecksum({ bytes, expectedChecksum, }) {
    const actual = createHash('sha256').update(bytes).digest('hex');
    return actual === expectedChecksum
        ? ok(bytes)
        : err(violation('checksum_mismatch', `expected ${expectedChecksum}, got ${actual}`));
}
function readVerifiedBytes({ path, expectedChecksum, }) {
    return readBytes(path).andThen((bytes) => verifyChecksum({ bytes, expectedChecksum }));
}
function readVerifiedText(reference) {
    return readVerifiedBytes(reference).andThen(decodeUtf8);
}
export { readVerifiedBytes, readVerifiedText };
//# sourceMappingURL=read-verified-file.js.map