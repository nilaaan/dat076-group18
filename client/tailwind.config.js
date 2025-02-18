import { skeleton, contentPath } from "@skeletonlabs/skeleton/plugin";
import * as themes from "@skeletonlabs/skeleton/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    contentPath(import.meta.url, "react"),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    skeleton({
      // NOTE: each theme included will increase the size of your CSS bundle
      themes: [themes.cerberus, themes.rose],
    }),
  ],
}
