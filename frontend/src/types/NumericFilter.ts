export default interface NumericFilterInterface {
  getValues: () => {
    min: number
    max: number
  }
  setValues: (min: number, max: number) => void
  reset: () => void
}
