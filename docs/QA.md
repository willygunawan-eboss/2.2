# QA Report
Date: Sat Jul 11 11:24:45 AM UTC 2026
## Lint Report
```

> react-example@0.0.0 lint
> tsc --noEmit

```
## Build Report
```

> react-example@0.0.0 build
> vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs

vite v6.4.3 building for production...
transforming...
✓ 2937 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                              0.47 kB │ gzip:   0.30 kB
dist/assets/index-DdDiIxod.css              64.77 kB │ gzip:  11.26 kB
dist/assets/purify.es-Csrj9YNg.js           28.14 kB │ gzip:  10.69 kB
dist/assets/index.es-CR47FJW1.js           159.59 kB │ gzip:  53.51 kB
dist/assets/html2canvas.esm-B0tyYwQk.js    202.36 kB │ gzip:  48.04 kB
dist/assets/index-C-J49o4L.js            2,357.56 kB │ gzip: 618.37 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 13.12s

  dist/server.cjs      240.2kb
  dist/server.cjs.map  369.4kb

⚡ Done in 37ms
```
