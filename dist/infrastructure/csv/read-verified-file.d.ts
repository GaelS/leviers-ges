import { Result } from 'neverthrow';
import { type Violation } from './violation.ts';
type VerifiedFileReference = {
    readonly path: string;
    readonly expectedChecksum: string;
};
declare function readVerifiedBytes({ path, expectedChecksum, }: VerifiedFileReference): Result<Buffer, Violation>;
declare function readVerifiedText(reference: VerifiedFileReference): Result<string, Violation>;
export { readVerifiedBytes, readVerifiedText };
