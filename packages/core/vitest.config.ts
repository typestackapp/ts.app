import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'a-vitest-plugin-that-changes-config',
      config: () => ({
        test: {
          setupFiles: [
            './common/test/vitest.setup.ts',
          ],
        },
      }),
    },
  ],
  test: {
    globals: true,
    isolate: false,
    // globalSetup: [
    //   './common/test/vitest.global.ts',
    // ],
  },
})