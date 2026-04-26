import path from "path"
import { pathToFileURL } from "url"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "")
  if (env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD) process.env.ADMIN_PASSWORD = env.ADMIN_PASSWORD
  if (env.ADMIN_USERNAME && !process.env.ADMIN_USERNAME) process.env.ADMIN_USERNAME = env.ADMIN_USERNAME
  if (env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN) process.env.BLOB_READ_WRITE_TOKEN = env.BLOB_READ_WRITE_TOKEN

  const apiRouteToFile: Record<string, string> = {
    "/api/admin/projects": path.resolve(__dirname, "./api/admin/projects.js"),
    "/api/admin/hackathons": path.resolve(__dirname, "./api/admin/hackathons.js"),
    "/api/admin/upload-image": path.resolve(__dirname, "./api/admin/upload-image.js"),
    "/api/admin/list-images": path.resolve(__dirname, "./api/admin/list-images.js"),
    "/api/admin/delete-image": path.resolve(__dirname, "./api/admin/delete-image.js"),
    "/api/admin/analytics": path.resolve(__dirname, "./api/admin/analytics.js"),
    "/api/public/projects": path.resolve(__dirname, "./api/public/projects.js"),
    "/api/public/project-images": path.resolve(__dirname, "./api/public/project-images.js"),
    "/api/public/hackathons": path.resolve(__dirname, "./api/public/hackathons.js"),
    "/api/public/hackathon-images": path.resolve(__dirname, "./api/public/hackathon-images.js"),
    "/api/public/track-view": path.resolve(__dirname, "./api/public/track-view.js"),
  }

  const localApiPlugin = () => ({
    name: "local-api",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        try {
          const originalUrl = String(req.url || "")
          if (!originalUrl.startsWith("/api/")) return next()

          const url = new URL(originalUrl, "http://localhost")
          const pathname = url.pathname
          const file = apiRouteToFile[pathname]
          if (!file) return next()

          const handlerModule = await import(pathToFileURL(file).href)
          const handler = handlerModule?.default
          if (typeof handler !== "function") return next()

          const jsonRes = res as any
          jsonRes.status = (code: number) => {
            res.statusCode = code
            return jsonRes
          }
          jsonRes.json = (payload: unknown) => {
            if (!res.headersSent) res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.end(JSON.stringify(payload))
            return jsonRes
          }

          const query: Record<string, string> = {}
          url.searchParams.forEach((value, key) => {
            query[key] = value
          })

          const patchedReq = req as any
          patchedReq.query = query

          const method = String(req.method || "GET").toUpperCase()
          if (method !== "GET" && method !== "HEAD") {
            const contentType = String(req.headers?.["content-type"] || "")
            const chunks: Buffer[] = []
            await new Promise<void>((resolve, reject) => {
              req.on("data", (chunk: Buffer) => chunks.push(chunk))
              req.on("end", () => resolve())
              req.on("error", reject)
            })
            const raw = Buffer.concat(chunks).toString("utf-8")
            if (contentType.includes("application/json")) {
              patchedReq.body = raw ? JSON.parse(raw) : {}
            } else {
              patchedReq.body = raw
            }
          }

          await handler(patchedReq, jsonRes)
        } catch (error) {
          const message = error instanceof Error ? error.message : "Local API error"
          if (!res.headersSent) res.statusCode = 500
          if (!res.headersSent) res.setHeader("Content-Type", "application/json; charset=utf-8")
          res.end(JSON.stringify({ error: message }))
        }
      })
    },
  })

  return {
    base: './',
    plugins: [inspectAttr(), react(), localApiPlugin()],
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
