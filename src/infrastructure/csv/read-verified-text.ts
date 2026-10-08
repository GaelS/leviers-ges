import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { Result, err, ok } from 'neverthrow'
import { violation, type Violation } from './violation.ts'

const readBytes = Result.fromThrowable(
  (path: string): Buffer => readFileSync(path),
  (error): Violation => violation('unreadable', String(error)),
)

const decodeUtf8 = Result.fromThrowable(
  (bytes: Buffer): string => new TextDecoder('utf-8', { fatal: true }).decode(bytes),
  (error): Violation => violation('not_utf8', String(error)),
)

function verifyChecksum({
  bytes,
  expectedChecksum,
}: {
  bytes: Buffer
  expectedChecksum: string
}): Result<Buffer, Violation> {
  const actual = createHash('sha256').update(bytes).digest('hex')
  return actual === expectedChecksum
    ? ok(bytes)
    : err(violation('checksum_mismatch', `expected ${expectedChecksum}, got ${actual}`))
}

function readVerifiedText({
  path,
  expectedChecksum,
}: {
  path: string
  expectedChecksum: string
}): Result<string, Violation> {
  return readBytes(path)
    .andThen((bytes) => verifyChecksum({ bytes, expectedChecksum }))
    .andThen(decodeUtf8)
}

export { readVerifiedText }
