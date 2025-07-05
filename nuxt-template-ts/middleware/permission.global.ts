// .global 包含的中间件是全局中间件
export default defineNuxtRouteMiddleware((to, from) => {
  //
  /*
  * TODO： 中间件运行顺序为：
  *  全局
  *     - 按名称顺序（强制顺序时，可以在前面通过加数字的方式指定顺序）
  *  页面中间件
  *     - 按照数组中书写顺序
  * */
  console.log(from, 'global.middleware')
  // return to.path
  return
})
