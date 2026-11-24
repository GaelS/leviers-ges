declare function createTemporaryDirectory(): string;
declare function copyDataFolders({ from, folders, }: {
    from: string;
    folders: readonly string[];
}): string;
declare function removeSourceFromManifest({ directory, folder, file, }: {
    directory: string;
    folder: string;
    file: string;
}): void;
declare function removeSourcesFromManifest({ directory, folder, }: {
    directory: string;
    folder: string;
}): void;
declare function setSourceChecksum({ directory, folder, file, checksum, }: {
    directory: string;
    folder: string;
    file: string;
    checksum: string;
}): void;
export { copyDataFolders, createTemporaryDirectory, removeSourceFromManifest, removeSourcesFromManifest, setSourceChecksum, };
