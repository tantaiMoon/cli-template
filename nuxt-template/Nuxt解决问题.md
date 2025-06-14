SEO 搜索引擎优化

1. 多页面
2. title 、描述、关键词
3. 网站的内容如何来

vue-cli 无法实现

vue-cli 无法实现SEO优化

如何实现：

- 预渲染： 页面加载完成之前，获取数据添加到页面上，生成 html 代码结构，只能解决部分问题(网站内容)。
  _打包多页面、解决没个页面生成单独的 title 和 描述关键词（metaInfo）、数据在html生成前获取，嫩能够被爬虫获取_

  _1. 无法实现动态路由；2. 来自接口的数据在 metaInfo 上不生效，会有 undefined 的闪动，而且源代码中找不到_
  预渲染的压力在客户端

  插件： prerender-spa-plugin、 修改关键词 vue-meta-info
  vue.config.js 配置

  ```js
  import PerrenderSPAPlugin from 'prerender-spa-plugin'
  module.exports = {
    publicPath: './',
    configureWebpack: {
      plugins: [
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, 'dist'),
          routes: ['/', '/about', '/contact']
        })
      ]
    }
  }
  ```

  app.vue

  ```js
  import metaInfo from 'vue-meta-info'
  Vue.use(metaInfo)

  export default {
    metaInfo: {
      title: '',
      meta: {
        name: '',
        content: ''
      }
    }
  }
  ```

  - 读取配置、获取预渲染页面
  - 发布模拟机制，浏览器打开页面
  - 页面脚本触发预渲染机制
  - 渲染当前页面
  - 获取当前所有 DOM 结构
  - 生成 HTML 文件

- metaInfo 添加 title 、 描述和关键词
- 服务端渲染
  通过 SSR 解决、Nuxtjs 可以有效解决。但是在页面加载之前数据渲染后才有 html 的 DOM 结构，这样的话可能会存在页面的空白
  - 一个项目全部需要做 SEO 优化
  -

## Nuxt 生命周期

Nuxt 2

1. 服务端生命周期

   - nuxtServerInit ，与页面无关，参数：
   - middleware 路由中间件（存放在 middleware 文件夹下或 middleware(){}），全局中间件和页面级中间件，页面级现在pages下的页面中。导航守卫等「参数：
     route, redirect,params,query,req,res」
   - validate 验证路由参数 validate({params, query}): boolean{} ， 返回值为空时页面跳转 404， 主要用来
   - asyncData 只限于在页面组件中使用（pages下的文件中），每次加载页面之前调用，一般都再次发送请求获取数据。参数： 「」
   - fetch 可以在组件也可以在页面中使用，用来填充状态树

2. 客户端生命周期

   - beforeMount
   - mounted
   - beforeUpdate
   - updated
   - beforeDestroy）
   - destroyed

3. 共同生命周期

   - beforeCreate 页面创建之前，无法访问 DOM 元素
   - created 页面创建之后，无法访问 DOM 元素

Nuxt 3 生命周期

1. 服务端
   - app:rendered
   - app:redirected
2. 客户端
   - app:beforeMount
   - app:mounted
   - app:suspense:resolve
   - app:manifest:update
   - link:prefetch
   - page:start
   - page:finish
   - page:loading:start
   - page:loading:end
   - page:transition:finish
   - dev:ssr-logs
   - page:view-transition:start
3. 共有
   - app:created
   - app:error
   - app:error:cleared {redirect: '/'}
   - app:data:refresh keys
   - vue:setup
   - vue:error
   -
