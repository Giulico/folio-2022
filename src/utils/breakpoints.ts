class Breakpoints {
  lg: number

  constructor() {
    this.lg = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--lg'),
      10
    )
  }
}

export default new Breakpoints()
