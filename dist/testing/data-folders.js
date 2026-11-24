import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { onTestFinished } from 'vitest';
function createTemporaryDirectory() {
    const directory = mkdtempSync(join(tmpdir(), 'leviers-ges-data-'));
    onTestFinished(() => {
        rmSync(directory, { recursive: true, force: true });
    });
    return directory;
}
function copyDataFolders({ from, folders, }) {
    const directory = createTemporaryDirectory();
    folders.forEach((folder) => {
        cpSync(join(from, folder), join(directory, folder), { recursive: true });
    });
    return directory;
}
function rewriteManifest({ directory, folder, rewrite, }) {
    const path = join(directory, folder, 'manifest.json');
    const manifest = JSON.parse(readFileSync(path, 'utf8'));
    rewrite(manifest);
    writeFileSync(path, JSON.stringify(manifest));
}
function removeSourceFromManifest({ directory, folder, file, }) {
    rewriteManifest({
        directory,
        folder,
        rewrite: (manifest) => {
            manifest.datasets.forEach((dataset) => {
                dataset.sources = (dataset.sources ?? []).filter((source) => source.file !== file);
            });
        },
    });
}
function removeSourcesFromManifest({ directory, folder, }) {
    rewriteManifest({
        directory,
        folder,
        rewrite: (manifest) => {
            manifest.datasets.forEach((dataset) => {
                delete dataset.sources;
            });
        },
    });
}
function setSourceChecksum({ directory, folder, file, checksum, }) {
    rewriteManifest({
        directory,
        folder,
        rewrite: (manifest) => {
            manifest.datasets.forEach((dataset) => {
                dataset.sources?.forEach((source) => {
                    if (source.file === file)
                        source.checksum = checksum;
                });
            });
        },
    });
}
export { copyDataFolders, createTemporaryDirectory, removeSourceFromManifest, removeSourcesFromManifest, setSourceChecksum, };
//# sourceMappingURL=data-folders.js.map