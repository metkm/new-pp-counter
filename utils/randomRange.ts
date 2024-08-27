export const randomRange = (min: number, max: number) => {
  return Math.floor((Math.random() * (max - min)) + min)
}
