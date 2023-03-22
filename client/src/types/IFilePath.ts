export default interface IFilePath {
  path: string[]
  children: string[]
}

export function makeIFilePath(filePath: string[], children?: string[]): IFilePath {
  return {
    path: filePath,
    children: children ?? [],
  }
}

/**
 * Determines if a object is a valid FilePath.
 *
 * @param fp any type
 */
export function isFilePath(fp: IFilePath | any): fp is IFilePath {
  const path = (fp as IFilePath).path
  const children = (fp as IFilePath).children
  const propsDefinied = path !== undefined && children !== undefined
  if (propsDefinied) {
    // check validity of path
    if (path.length <= 0) {
      return false
    }
    // check validity of children
    if (Array.isArray(children)) {
      children.forEach(function(item) {
        if (typeof item !== 'string') {
          return false
        }
      })
      return true
    }
  }
  return false
}
