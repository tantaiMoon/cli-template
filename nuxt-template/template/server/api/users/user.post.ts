export default defineEventHandler(async (evt) => {
    const body = await readBody(evt)
  return {
      ...body,
    time: new Date().toLocaleString()
  }
})
