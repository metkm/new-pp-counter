const element = document.createElement('div')

export const escapeCharacters = (str: string) => {
  element.innerHTML = str
  return element.innerText
}
