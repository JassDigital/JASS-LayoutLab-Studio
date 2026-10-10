# JASS LayoutLab Studio v0.3.0

A Windows-first Electron + React + Vite visual workbench for exploring responsive layout patterns and planning native React layout-library integrations.

## Features in this foundation release

- Dark three-column workbench: library navigator, live canvas, properties inspector.
- Layout pattern prototypes: responsive grid, masonry wall, split workspace, tiled dashboard.
- Select and edit panel title, category, description, size and accent color.
- Canvas controls for columns, gap, and corner radius.
- Desktop, tablet, and mobile-width preview modes.
- Search and select among the supplied layout-library catalog, with links to each repository.
- Save the current starter configuration to browser local storage; reset to the starter layout.
- JSX preview and React/Vite ZIP export.
- Electron desktop shell and browser development mode.

## Run on Windows

Install a current Node.js LTS release, extract this folder, open PowerShell in the project directory, and run:

```powershell
npm install
npm run desktop
```

Browser mode:

```powershell
npm run dev
```

Production build check:

```powershell
npm run build
```

## Honest integration status

This is the foundation release. The visual canvas currently uses local React/CSS prototypes; it does not claim to have integrated every catalog library. React Grid Layout is the first native adapter: when selected, the live canvas uses its GridLayout component with drag handles, resizing, and editable layout state. The exported React/Vite project uses the native GridLayout API and includes the library styles and dependencies. Other catalog entries remain planned and are not yet native integrations. Full dependency installation/build validation remains pending in environments with npm registry access.

## Exported project

Use **Export React project** in the app. The downloaded ZIP contains a Vite React starter, generated `Layout.jsx`, `Layout.css`, package manifest and README.


## v0.3: Muuri React adapter

Select **Muuri React** in the library list to use its native `MuuriComponent` grid with drag sorting. The exported React/Vite project includes `muuri-react`, the selected panel data, a text filter, and the styles needed for the grid. Muuri React is a third-party dependency; run `npm install` and `npm run build` locally to validate installation against your Node/npm environment.


### Dependency compatibility note (v0.3.4)

This release pins React and React DOM to 17.0.2 because `muuri-react@3.1.7` declares a React 17 peer dependency. The entry point uses `ReactDOM.render`, compatible with React 17.


### v0.3.4 fix
- Fixed nested template-string syntax in the Muuri React project exporter.
- Pinned the Vite 6-compatible React plugin.
- Muuri React exports use React 17 to satisfy its declared peer dependency.
