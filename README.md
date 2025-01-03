# MBTA Explorer Frontend

This project is a frontend application for visualizing live MBTA subway data on a map. It uses Leaflet.js to display the map and route information, and it fetches real-time vehicle data for various subway routes. The project is built using Svelte, Vite, and TypeScript.

## Features

- Displays subway routes on a map.
- Visualizes real-time vehicle positions for various subway routes.
- Allows overlaying subway routes and live vehicle tracking.
- Supports custom route and stop markers with different colors.

## Tech Stack

- **Frontend Framework**: Svelte
- **Map Library**: Leaflet.js
- **Build Tool**: Vite
- **HTTP Requests**: simple-fetch-ts
- **TypeScript**: Static typing for enhanced development experience

## Prerequisites

To get started with this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A modern browser (e.g., Chrome, Firefox)

## Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd mbta-explorer-frontend
   ```

2. **Install dependencies**:
   This will install all required development and production dependencies.

   ```bash
   npm install
   ```

3. **Configure the backend**:
   Ensure the backend API for fetching MBTA subway data is running at `http://localhost:8080`. This backend should provide the following endpoints:

   - `/api/routes?route_ids={route_ids}`: Fetch subway route data.
   - `/api/live?route_id={route_id}`: Fetch live vehicle data for a given route.

4. **Run the development server**:
   To start the development environment, run:

   ```bash
   npm run dev
   ```

   This will start the app at `http://localhost:3000` by default. You can access the app in your browser.

5. **Build the project for production**:
   To build the app for production, use:

   ```bash
   npm run build
   ```

6. **Preview the production build**:
   To preview the production build locally, use:
   ```bash
   npm run preview
   ```

## Scripts

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the app for production.
- **`npm run preview`**: Preview the production build.
- **`npm run check`**: Run type-checking and linting.

## Project Structure

- **`src/`**: Contains the main application code.
  - **`components/`**: Contains Svelte components, such as the map view.
  - **`stores/`**: Contains Svelte stores for state management (e.g., map data and overlays).
  - **`App.svelte`**: The root Svelte component.
  - **`main.ts`**: Entry point for bootstrapping the app.
- **`public/`**: Contains static assets like the HTML template (`index.html`).

## Key Components

### `App.svelte`

This is the root component that renders the map view. It imports the `Map.svelte` component and initializes it within the container.

```svelte
<script>
  import Map from "./components/Map.svelte";
</script>

<div id="map-container">
  <Map />
</div>

<style>
  #map-container {
    height: 100vh;
    width: 100%;
  }
</style>
```

### `main.ts`

This is the entry point of the app. It mounts the `App.svelte` component to the `#app` element in the HTML and imports necessary styles for Leaflet.

```typescript
import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import "leaflet/dist/leaflet.css";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
```

### `Map.svelte`

The `Map.svelte` component handles rendering the map, fetching route data, and displaying the subway routes and live vehicle positions using Leaflet.js. It interacts with various stores to manage state and updates the map dynamically.

## Functions Overview

### `plotMultipleRoutes`

This function plots multiple subway routes on the map, creating polyline shapes for routes and circle markers for stops.

```typescript
export const plotMultipleRoutes = (
  layerControl: L.Control.Layers,
  routes: Route[],
): void => {
  // Implementation details...
};
```

### `plotLiveData`

This function plots live vehicle data on the map, replacing any existing data for the specified route. It uses a lock mechanism to prevent concurrent updates for the same route.

```typescript
export const plotLiveData = async (
  layerControl: Control.Layers,
  vehicles: any[],
  routeId: string,
): Promise<void> => {
  // Implementation details...
};
```

## Styling

The application uses Leaflet for map rendering, which requires the `leaflet.css` file. The map container is styled to take up the full viewport height (`100vh`), and the map is responsive to window size changes.

```css
#map-container {
  height: 100vh;
  width: 100%;
}
```

## Troubleshooting

- **Backend connection issue**: Ensure the backend API is running at `http://localhost:8080` and accessible from the frontend.
- **Missing map tiles**: Verify that Leaflet's default tile layers are loading correctly. You can replace the tile layer URL if needed for custom maps.

## Contributing

Feel free to fork the repository, make changes, and submit pull requests. When contributing, please ensure that your code follows the existing style and includes appropriate tests where necessary.

### License

This project is open-source and available under the [MIT License](LICENSE).

### Key Sections:

1. **Setup & Installation**: Covers the steps needed to set up and run the project locally.
2. **Tech Stack**: Lists the technologies and dependencies used in the project.
3. **Scripts**: Explains the available npm scripts.
4. **Project Structure**: Details the folder structure and key files.
5. **Key Components**: Explains the core Svelte components and their responsibilities.
6. **Functions Overview**: Provides a brief overview of the main functions (`plotMultipleRoutes` and `plotLiveData`).
7. **Troubleshooting**: Common issues and solutions.
8. **Contributing**: Instructions for contributing to the project.

# Svelte + TS + Vite

This template should help get you started developing with Svelte and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + TypeScript + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from "svelte/store";
export default writable(0);
```
