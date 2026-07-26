# NASA Image Explorer

[![Angular](https://img.shields.io/badge/Angular-v21.0.0%2B-red?logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## Project Description

The NASA Image Explorer is an Angular application designed to showcase images and videos from NASA's Astronomy Picture of the Day (APOD) archive. Users can browse today's APOD, explore a gallery of images, search for specific entries by date, and manage a personalized collection of favorite APODs. The application includes a comprehensive fullscreen image viewer with zoom and pan functionalities, enhancing the user experience for media exploration.

## Live Demo

<video controls><source src="https://youtu.be/jJCwgHhxc1w?si=AUu4mnMeC0FdYitu" type="video/mp4"></video>

## Key Features

*   **Daily APOD Display:** Presents the Astronomy Picture of the Day on the homepage.
*   **Image/Video Gallery:** Allows browsing a collection of random or date-range-filtered APOD entries.
*   **Detailed Media View:** Provides a dedicated page for each APOD entry with its title, explanation, and media.
*   **Search Functionality:** Enables searching for APOD entries within a specified date range.
*   **Favorites Management:** Users can add and remove APODs from a local favorites list, persisted in browser storage.
*   **Interactive Fullscreen Viewer:** Features a modal for viewing images with zoom (mouse wheel, pinch-to-zoom, keyboard), pan (drag, arrow keys), and reset capabilities.
*   **HTTP Caching:** Implements an HTTP interceptor to cache GET requests to the NASA APOD API, improving response times for repeated requests.
*   **Centralized Error Handling:** Utilizes an HTTP interceptor to gracefully manage and display API-related errors, such as rate limiting, network issues, and server errors.
*   **Server-Side Rendering (SSR):** Configured to enhance initial load performance and search engine optimization.
*   **Responsive Design:** Optimized for display across various devices and screen sizes.

## Tech Stack

*   **Frontend Framework:** Angular (v21.0.0+)
*   **Language:** TypeScript (v5.9.2)
*   **UI Components:** Angular Material (v21.0.1+)
*   **State Management:** RxJS (v7.8.0+) with `BehaviorSubject` in services
*   **HTTP Client:** `@angular/common/http`
*   **Routing:** `@angular/router`
*   **Styling:** SCSS
*   **Build Tool:** Angular CLI
*   **Server-Side Rendering:** Angular SSR, Express (v5.1.0+)
*   **Testing:** Vitest (v4.0.8+)
*   **Loading States:** ngx-skeleton-loader (v13.0.0+)

## Project Structure

```
src/
├── app/
│   ├── app.config.ts             # Application's root configuration (standalone)
│   ├── app.routes.ts             # Main application routing
│   ├── components/               # Standalone components for distinct views/features
│   │   ├── favorites/
│   │   ├── home/
│   │   ├── image-detail/
│   │   ├── image-gallery/
│   │   └── search/
│   ├── core/                     # Core application logic (services, interceptors, models)
│   │   ├── interceptor/          # HTTP Interceptors (Error, Cache)
│   │   ├── models/               # Data models (e.g., Apod interface)
│   │   └── services/             # Application-wide services (API, state management)
│   └── shared/                   # Reusable components, pipes, and utilities
│       ├── components/           # Generic UI components (e.g., ApodCard, ImageFullscreen)
│       ├── pipes/                # Custom pipes (e.g., SafeUrl)
│       └── utils/                # Utility functions
├── environments/                 # Environment-specific configuration
├── public/                       # Static assets
├── styles.scss                   # Global styles
└── main.ts                       # Application entry point
```

## Getting Started

### Prerequisites

Ensure you have Node.js and npm (or a compatible package manager like `npm@10.9.4`) installed.

*   Node.js (LTS version recommended)
*   npm (v10.9.4 or higher)
*   Angular CLI (install globally if not already present: `npm install -g @angular/cli`)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/zidi-abderrahmen/nasa-image-explorer.git
    cd nasa-image-explorer
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure API Key:**
    The `src/environments/environment.local.ts` file is used for local development but is `.gitignored`. You will need to create this file manually. As a template, you can refer to `src/environments/environment.example.ts`. Replace `'YOUR_NASA_API_KEY_HERE'` with your actual NASA API key. You can obtain one from the [NASA API website](https://api.nasa.gov/).

### Development Server

Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

To build for production:
```bash
ng build --configuration production
```

To build and serve the SSR version:
```bash
npm run build
npm run serve:ssr:nasa-image-explorer
```
Then navigate to `http://localhost:4000/`.

## Testing

Run `npm test` to execute the unit tests via Vitest.

```bash
npm test
```

This command typically runs tests in watch mode by default.

## Architecture Overview

This project leverages Angular's **standalone components** architecture, eliminating the need for traditional `NgModule` declarations at the root level.

*   **Routing:** Implemented using `provideRouter` in `app.config.ts`, defining clear, client-side routes for navigation between different features.
*   **Module Organization:** Features are primarily organized as standalone components within `src/app/components`, with common logic and UI elements abstracted into `src/app/core` (for services, interceptors, models) and `src/app/shared` (for reusable components, pipes, utilities).
*   **State Management:** Achieved through **RxJS `BehaviorSubject`** within dedicated services (`FavoritesService`, `GalleryState`, `HomeImageState`). This pattern provides observable streams for component data, promoting a reactive and predictable state flow without a complex global store.
*   **Service Structure:** Services are injected using Angular's dependency injection system. `NasaApi` handles all external API interactions. `FavoritesService` manages local storage persistence for user favorites. Dedicated state services manage the UI-specific data for various views.
*   **Interceptors:** Two global HTTP interceptors are implemented:
    *   `errorInterceptor`: Catches and handles HTTP errors, providing user-friendly messages for common API issues.
    *   `HttpCacheInterceptor`: Caches successful GET requests for a configurable duration to optimize performance and reduce API calls.
*   **Shared/Common Functionality:** The `src/app/shared` directory contains reusable `ApodCard` for displaying APOD details, `ApodSkeletonCard` for loading states, `ImageFullscreen` for an interactive media viewer, `SafeUrlPipe` for sanitizing URLs, and `date.utils.ts` for date formatting.

## Notes

*   The application uses Angular's new standalone components, providing a modular and streamlined development experience without NgModules.
*   Local storage is used for persisting user favorites.
*   Error handling for NASA API requests is robust, providing specific feedback for different error scenarios, including rate limiting (HTTP 429).
*   The `ImageFullscreen` component demonstrates advanced DOM manipulation and event handling for a rich interactive experience.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository, create a new branch for your features or bug fixes, and submit a pull request.

## License

This project is licensed under the [MIT License](./LICENSE).

## Author

**Abdo**
*   LinkedIn: [Zidi Abderrahmen](https://www.linkedin.com/in/zidi-abderrahmen)
*   Portfolio: [My Portfolio](https://zidi-abderrahmen.github.io/my-portfolio-v2/)
