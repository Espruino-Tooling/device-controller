export function stringifyFunction(func: Function): string {
  console.log(func.toString());
  return func.toString().split('\n').slice(1, -1).join('\n');
}
