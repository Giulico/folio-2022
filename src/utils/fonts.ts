import WebFont from 'webfontloader'

export const fontLoader = () => {
  return new Promise((resolve) => {
    WebFont.load({
      classes: false,
      google: {
        families: ['Saira Semi Condensed:300,500,600,700:latin']
      },
      active: () => {
        resolve(null)
      }
    })
  })
}
