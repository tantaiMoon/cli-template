export default defineEventHandler((evt) => {
  // return {
  //   name: 'nuxt moyi'
  // }
  return Promise.resolve({
    name: 'nuxt moyi',
    path: evt.path
  })
})
