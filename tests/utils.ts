export function omit(obj: Record<string, any>, props: string[]): object {
  const obj2: Record<string, any> = {};
  Object.keys(obj).forEach(key => !props.includes(key) && (obj2[key] = obj[key]));
  return obj2;
}
