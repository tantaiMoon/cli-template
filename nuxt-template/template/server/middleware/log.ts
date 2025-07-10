export default defineEventHandler((evt) => {
  const newReq = getRequestURL(evt)
  console.log('request: ', newReq)
})
