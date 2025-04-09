import { TailwindInput, TailwindModule } from "@ts.app/core/common/cli/typedefs.js"

const dev: TailwindInput = {
  input: "./static/tailwind.dev.tpl.css",
  output: "./next/public/dev.css",
  config: {
    content: [
      "./components/**/*.{js,ts,jsx,tsx}",
      "./next/app/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      extend: {
        textColor: {
          skin: {
            base: 'var(--color-txt-base)',
            muted: 'var(--color-txt-muted)',
            // inverted: 'var(--color-text-inverted)',
          }
        }
      }
    },
    plugins: [],
  }
}

export default { dev } satisfies TailwindModule