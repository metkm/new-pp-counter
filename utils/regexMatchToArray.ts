// Currently only works for a tags
const elementInnerTextRegex = new RegExp(/<a.*>(.*)<\/a>/g)

export const regexMatchGroupToArray = (str: string) => {
  const result = []

  const match = str.matchAll(elementInnerTextRegex)

  for (const element of match) {
    const name = element[1];
    result.push(escapeCharacters(name))
  }

  return result
}
