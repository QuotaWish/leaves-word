/* eslint-disable regexp/no-useless-quantifier */
export function isExternal(path: string): boolean {
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const reg = /(?:^https?:(?:\/\/)?(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)(?:(?:\/[+~%/.\w-]*)?\??[-+=&;%@.\w]*(?:#\w*)?)?$/
  return reg.test(path)
}
