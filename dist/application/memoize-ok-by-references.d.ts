import type { Result } from 'neverthrow';
declare function memoizeOkByReferences<First extends object, Second extends object, Value, Failure>(compute: (first: First, second: Second) => Result<Value, Failure>): (first: First, second: Second) => Result<Value, Failure>;
export { memoizeOkByReferences };
