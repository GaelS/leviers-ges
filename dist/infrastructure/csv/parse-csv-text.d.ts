import { Result } from 'neverthrow';
import { type Violation } from './violation.ts';
type CsvTextOptions = {
    readonly text: string;
    readonly delimiter: string;
};
declare const parseCsvText: (args_0: CsvTextOptions) => Result<readonly Readonly<Record<string, string>>[], Violation>;
export { parseCsvText };
