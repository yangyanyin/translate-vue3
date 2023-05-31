import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import router from './router/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = (p) => path.resolve(__dirname, p)

const isProd = process.env.NODE_ENV === 'production';

const app = express()
app.use(router)

// console.log(router(), 2)
// 以中间件模式创建 Vite 应用，这将禁用 Vite 自身的 HTML 服务逻辑
// 并让上级服务器接管控制
let vite
if (!isProd) {
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  app.use(vite.middlewares)
} else {
  app.use('/', (
    await import('serve-static')).default(resolve('public/client'), {
      index: false,
    }),
  )
}

app.use('*', async (req, res, next) => {
  const url = req.originalUrl
  try {
    let template, render
    if (!isProd) {
      template = fs.readFileSync(path.resolve(__dirname, '../index.html'),'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.js')).render
    } else {
      template = fs.readFileSync(resolve('./public/client/index.html'), 'utf-8')
      render = (await import('./public/server/entry-server.js')).render
    }
    
    const [ appHtml, state, metaSeo ] = await render(url)
    const html = template
    .replace('<!--ssr-outlet-->', appHtml)  
    .replace("'<!--vuex-state-->'", state)
    .replace('<!--meta-seo-outlet-->', metaSeo)

    // 6. 返回渲染后的 HTML。
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // 如果捕获到了一个错误，让 Vite 来修复该堆栈，这样它就可以映射回
    // 你的实际源码中。
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
const port = 5173
app.listen(port, () => console.info(`\x1b[42;30m 服务启动成功:\x1b[0;32m \x1b[4mhttp://localhost:${port}\x1b[0m`))
