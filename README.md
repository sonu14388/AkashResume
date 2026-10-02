# Free CV Maker — WebGL 3D Resume Studio

A React + TypeScript resume builder with an orange/charcoal editorial direction, original WebGL 3D objects, live A4 resume preview, 550+ templates, and PDF/DOCX exports.

The interface uses React Three Fiber and Drei for the animated 3D workspace. The resume paper itself remains a clean 2D A4 surface so ATS parsing, printing, and exports stay reliable. The supplied reference artwork is used as visual direction; the hero objects are rendered from original geometry in the app.

## Run locally

**Prerequisite:** Node.js 18+

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser with WebGL enabled.

## Useful commands

```bash
npm run lint   # TypeScript check
npm run build  # Production build
```

## Main areas

- `src/components/three/ThreeDScene.tsx` — WebGL scene, floating resume panel, parallax, and mode palettes.
- `src/components/builder/` — Resume editor forms and live preview.
- `src/components/templates/` — ATS-friendly 2D resume templates.
- `src/utils/pdfExport.ts` and `src/utils/docxExport.ts` — Export pipelines.
