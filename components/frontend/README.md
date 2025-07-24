# 🎨 Microadventures Frontend

Modern React application providing an intuitive interface for AI-generated adventure planning with interactive maps, real-time weather, and a seamless user experience across all devices. This frontend is built to be fast, responsive, and easy to maintain.

## ✨ Why This Stack?

This project uses a modern, component-based architecture to create a rich user experience. Here’s why these technologies were chosen:

- **React 19**: The latest version of the most popular JavaScript library for building user interfaces. Its component-based architecture and virtual DOM make it perfect for building complex, interactive UIs.
- **Vite**: A next-generation frontend tooling that is incredibly fast. It offers a faster and leaner development experience compared to other bundlers.
- **Tailwind CSS**: A utility-first CSS framework that allows for rapid UI development without leaving your HTML. It's highly customizable and great for building responsive designs.
- **React Router 7**: The latest version of the standard library for routing in React. It enables the creation of a single-page application with navigation that feels like a native app.
- **Axios**: A promise-based HTTP client for the browser and Node.js. It makes it easy to send asynchronous HTTP requests to REST endpoints and perform CRUD operations.
- **Leaflet + OpenStreetMap**: Leading open-source solution for mobile-friendly, interactive maps. No Google Maps required—modern, fast, and privacy-friendly.
- **Lucide React**: A beautiful and consistent icon toolkit.
- **Styled Components**: A popular library for styling React applications. It allows you to write actual CSS code to style your components.

## 🛠️ Tech Stack

- **React 19**: Modern hooks-based architecture with concurrent features
- **Vite**: Lightning-fast build tool with HMR and optimized bundling
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **React Router 7**: Client-side routing with nested routes
- **Axios**: Promise-based HTTP client
- **Leaflet + OpenStreetMap**: Interactive maps (no Google Maps)
- **Lucide React**: Icon library
- **Styled Components**: CSS-in-JS

## 🚀 Getting Started

### Prerequisites

- **Devbox**: For setting up the development environment.
- **Node.js** 20.x

### Development Setup

1. **Initialize the development environment:**

   ```bash
   devbox shell
   ```

2. **Install dependencies:**

   ```bash
   cd components/frontend
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui
```

## 🚀 Deployment

The frontend is deployed using Kubernetes manifests in `/k8s/components/frontend/`. See the [Kubernetes README](../../k8s/README.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
