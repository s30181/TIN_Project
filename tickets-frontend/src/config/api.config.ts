import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: `http://${process.env.VITE_BACKEND_HOST ?? 'localhost'}:${process.env.VITE_BACKEND_PORT ?? '3000'}/docs-json`,
  output: 'src/api',
  plugins: [
    {
      name: '@hey-api/client-fetch',
      baseUrl: `http://${process.env.VITE_BACKEND_HOST ?? 'localhost'}:${process.env.VITE_BACKEND_PORT ?? '3000'}`,
    },
    {
      name: 'zod',
    },
    {
      name: '@hey-api/sdk',
      validator: true,
      transformer: true,
    },
    {
      name: '@hey-api/transformers',
      dates: true,
      bigInt: true,
    },
  ],
})
