class Breakpoints {
  mdP: number
  mdL: number
  lg: number
  xl: number

  constructor() {
    this.mdP = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--md-p'), 10)
    this.mdL = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--md-l'), 10)
    this.lg = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--lg'), 10)
    this.xl = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--xl'), 10)
  }
}

export default new Breakpoints()
