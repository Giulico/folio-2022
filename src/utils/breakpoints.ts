class Breakpoints {
  mdL: number
  lg: number

  constructor() {
    this.mdL = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--md-l'), 10)
    this.lg = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--lg'), 10)
  }
}

export default new Breakpoints()
