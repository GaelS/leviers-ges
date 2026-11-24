import { parse } from 'csv-parse/sync';
import { Result } from 'neverthrow';
import { z } from 'zod';
import { violation } from "./violation.js";
function rejectDuplicateColumns(header) {
    if (new Set(header).size !== header.length)
        throw new Error('duplicate column names');
    return header;
}
const rowsSchema = z.array(z.record(z.string(), z.string()));
const parseCsvText = Result.fromThrowable(({ text, delimiter }) => rowsSchema.parse(parse(text, { columns: rejectDuplicateColumns, skip_empty_lines: true, delimiter })), (error) => violation('malformed_csv', String(error)));
export { parseCsvText };
//# sourceMappingURL=parse-csv-text.js.map