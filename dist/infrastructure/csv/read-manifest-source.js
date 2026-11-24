import { join } from 'node:path';
import { err, ok } from 'neverthrow';
import { invalidDataset } from "../../domain/data-source.js";
import { readVerifiedBytes, readVerifiedText } from "./read-verified-file.js";
function findSourceChecksum({ entry, file, dataset, }) {
    const source = entry.sources?.find((candidate) => candidate.file === file);
    return source === undefined
        ? err(invalidDataset({ dataset, reason: 'invalid_manifest', detail: file }))
        : ok(source.checksum);
}
function toSourceFailure({ dataset, file }) {
    return ({ reason, detail }) => invalidDataset({ dataset, reason, detail: `${file}: ${detail}` });
}
function readManifestSourceBytes({ folderPath, entry, file, dataset, }) {
    return findSourceChecksum({ entry, file, dataset }).andThen((expectedChecksum) => readVerifiedBytes({ path: join(folderPath, file), expectedChecksum }).mapErr(toSourceFailure({ dataset, file })));
}
function readManifestSourceText({ folderPath, entry, file, dataset, }) {
    return findSourceChecksum({ entry, file, dataset }).andThen((expectedChecksum) => readVerifiedText({ path: join(folderPath, file), expectedChecksum }).mapErr(toSourceFailure({ dataset, file })));
}
export { readManifestSourceBytes, readManifestSourceText };
//# sourceMappingURL=read-manifest-source.js.map