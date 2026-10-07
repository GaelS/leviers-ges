import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'csv-parse/sync'
import { Result, err, ok } from 'neverthrow'
import { z } from 'zod'
import { invalidDataset, type DataRow, type InvalidDataset } from '../../domain/data-source.js'
import { findDatasetEntry, type DatasetEntry } from './manifest.js'
import type { Level } from '../../domain/territory.js'
import {
  checkCells,
  checkColumns,
  checkControlTotals,
  checkNotEmpty,
  indexByKey,
} from './validate-rows.js'
import { violation, type Violation } from './violation.js'

type Dataset = {
  readonly level: Level | undefined
  readonly rows: ReadonlyMap<string, DataRow>
}

function rejectDuplicateColumns(header: string[]): string[] {
  if (new Set(header).size !== header.length) throw new Error('duplicate column names')
  return header
}

const rowsSchema = z.array(z.record(z.string(), z.string()))

const datasetNamePattern = /^([a-z0-9-]+)\/([a-z0-9-]+)$/

const readBytes = Result.fromThrowable(
  (path: string): Buffer => readFileSync(path),
  (error): Violation => violation('unreadable', String(error)),
)

const decodeUtf8 = Result.fromThrowable(
  (bytes: Buffer): string => new TextDecoder('utf-8', { fatal: true }).decode(bytes),
  (error): Violation => violation('not_utf8', String(error)),
)

const parseCsv = Result.fromThrowable(
  (text: string): readonly DataRow[] =>
    rowsSchema.parse(
      parse(text, { columns: rejectDuplicateColumns, skip_empty_lines: true, delimiter: ',' }),
    ),
  (error): Violation => violation('unreadable', String(error)),
)

function splitDatasetName(name: string): Result<{ folder: string; file: string }, Violation> {
  const match = datasetNamePattern.exec(name)
  const [, folder, file] = match ?? []
  return folder === undefined || file === undefined
    ? err(violation('unknown_dataset', name))
    : ok({ folder, file: `${file}.csv` })
}

function verifyChecksum(bytes: Buffer, entry: DatasetEntry): Result<Buffer, Violation> {
  const actual = createHash('sha256').update(bytes).digest('hex')
  return actual === entry.checksum
    ? ok(bytes)
    : err(violation('checksum_mismatch', `expected ${entry.checksum}, got ${actual}`))
}

function loadDataset({
  rootDirectory,
  name,
}: {
  rootDirectory: string
  name: string
}): Result<Dataset, InvalidDataset> {
  return splitDatasetName(name)
    .andThen(({ folder, file }) =>
      findDatasetEntry({ rootDirectory, folder, file }).map((entry) => ({ entry, folder })),
    )
    .andThen(({ entry, folder }) =>
      readBytes(join(rootDirectory, folder, entry.file))
        .andThen((bytes) => verifyChecksum(bytes, entry))
        .andThen(decodeUtf8)
        .andThen(parseCsv)
        .andThen(checkNotEmpty)
        .andThen((rows) => checkColumns(rows, entry))
        .andThen(checkCells)
        .andThen((rows) => checkControlTotals(rows, entry.controlTotals ?? {}))
        .andThen((rows) => indexByKey(rows, entry.keyColumn))
        .map((rows): Dataset => ({ level: entry.level, rows })),
    )
    .mapErr(({ reason, detail }) => invalidDataset({ dataset: name, reason, detail }))
}

export { loadDataset }
export type { Dataset }
