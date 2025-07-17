# 🎨 Microadventures Frontend

Modern React application providing an intuitive interface for AI-generated adventure planning with interactive maps, real-time weather, and seamless user experience across all devices.

## 🚀 Tech Stack

### **Core Technologies**

- **React 18**: Modern hooks-based architecture with concurrent features
- **Vite**: Lightning-fast build tool with HMR and optimized bundling
- **TypeScript**: Static typing for enhanced developer experience (optional)
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

### **UI & Interaction**

- **React Router 6**: Client-side routing with nested routes
- **Styled Components**: CSS-in-JS for complex component styling
- **Lucide React**: Beautiful, customizable SVG icon library
- **Framer Motion**: Smooth animations and transitions (optional)

### **Maps & Location**

- **Google Maps API**: Interactive map integration
- **Geolocation API**: Automatic location detection
- **Places API**: Location search and autocomplete

### **State Management**

- **React Context**: Global state for authentication and user data
- **Custom Hooks**: Reusable stateful logic
- **Local Storage**: Persistent user preferences and session data

## 🏗️ Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Plan.jsx            # Main adventure planning interface
│   ├── AdventureResult.jsx # Adventure display and interaction
│   ├── History.jsx         # Adventure history with pagination
│   ├── MapPicker.jsx       # Interactive location selection
│   ├── SharedAdventure.jsx # Public adventure viewing
│   ├── ProtectedRoute.jsx  # Authentication guard
│   └── ...
├── contexts/               # React Context providers
│   └── AuthContext.jsx    # Authentication state management
├── hooks/                  # Custom React hooks
│   ├── useCountdown.js     # Quota countdown timer
│   └── useGeolocation.js   # Location detection
├── utils/                  # Utility functions
│   ├── api.js             # API client with error handling
│   └── helpers.js         # Common helper functions
├── styles/                 # Global styles and theme
│   └── index.css          # Tailwind imports and custom styles
├── assets/                 # Static assets
└── main.jsx               # Application entry point
```

## 🚀 Quick Start

### **Prerequisites**

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn/pnpm)
- **Google Maps API Key** (for map functionality)

### **Installation**

```bash
# Navigate to frontend directory
cd components/frontend

# Install dependencies
npm install

# Or using yarn
yarn install

# Or using pnpm (faster)
pnpm install
```

### **Environment Configuration**

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env  # or your preferred editor
```

### **Environment Variables**

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Google Maps Integration
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Optional: Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false

# Optional: External Services
VITE_UNSPLASH_ACCESS_KEY=your-unsplash-key
```

### **Development Server**

```bash
# Start development server
npm run dev

# Or with custom port
npm run dev -- --port 3000

# Or with host binding
npm run dev -- --host 0.0.0.0
```

## 🎯 Key Features

### **Adventure Planning Interface**

- **Interactive Form**: Intuitive multi-step adventure configuration
- **Map Integration**: Visual location selection with search
- **Smart Defaults**: Auto-detection of user location
- **Real-time Validation**: Instant feedback on form inputs

### **Adventure Display**

- **Responsive Cards**: Beautiful adventure presentation
- **Scrollable Content**: Optimized for mobile and desktop
- **Interactive Elements**: Checkable packing lists, clickable maps
- **Rich Media**: High-quality images and visual indicators

### **User Management**

- **Secure Authentication**: JWT-based login with auto-refresh
- **Profile Management**: User preferences and settings
- **Session Persistence**: Seamless experience across browser sessions
- **Quota Tracking**: Visual progress and countdown timers

### **History & Sharing**

- **Paginated History**: Efficient browsing of past adventures
- **Adventure Sharing**: Public links with beautiful presentation
- **Search & Filter**: Find specific adventures quickly
- **Export Options**: Save adventures for offline viewing

## 📱 Responsive Design

### **Breakpoint Strategy**

```css
/* Mobile First Approach */
.component {
  /* Base styles (mobile) */
}

@media (min-width: 640px) {
  /* sm: tablets */
  .component {
    /* tablet styles */
  }
}

@media (min-width: 1024px) {
  /* lg: desktop */
  .component {
    /* desktop styles */
  }
}

@media (min-width: 1280px) {
  /* xl: large desktop */
  .component {
    /* large desktop styles */
  }
}
```

### **Device Optimization**

- **Touch-Friendly**: Appropriate tap targets and gestures
- **Performance**: Optimized bundle sizes and lazy loading
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **PWA Ready**: Service worker and manifest configuration

## 🔧 Development

### **Available Scripts**

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check (if using TypeScript)
npm run type-check
```

### **Code Quality Tools**

```bash
# ESLint configuration
{
  "extends": [
    "eslint:recommended",
    "@vitejs/eslint-config-react"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": "error"
  }
}

# Prettier configuration
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## 🎨 Styling Architecture

### **Tailwind CSS Setup**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8fcfa",
          500: "#46a080",
          900: "#0c1c17",
        },
      },
    },
  },
};
```

### **Component Styling Patterns**

```jsx
// Utility-first with Tailwind
const Button = ({ variant = "primary", children, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantClasses = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

// Styled Components for complex styling
const MapContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;

  .google-map {
    width: 100%;
    height: 400px;

    @media (max-width: 768px) {
      height: 300px;
    }
  }
`;
```

## 🔌 API Integration

### **API Client Architecture**

```javascript
// utils/api.js
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Adventure endpoints
  async generateAdventure(data) {
    return this.request("/api/adventures/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUserHistory() {
    return this.request("/api/adventures/my-history");
  }
}

export const api = new ApiClient(import.meta.env.VITE_API_BASE_URL);
```

### **Error Handling Strategy**

```jsx
// Custom hook for API calls
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error };
};
```

## 🗺️ Maps Integration

### **Google Maps Setup**

```jsx
// MapPicker.jsx
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const handleMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={selectedLocation}
        zoom={13}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};
```

## 🧪 Testing

### **Testing Setup**

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### **Test Examples**

```jsx
// __tests__/Plan.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider } from "../contexts/AuthContext";
import Plan from "../components/Plan";

const renderWithAuth = (component) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe("Plan Component", () => {
  test("renders adventure planning form", () => {
    renderWithAuth(<Plan />);
    expect(screen.getByText("Plan Your Adventure")).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    renderWithAuth(<Plan />);
    const submitButton = screen.getByText("Generate Adventure");
    fireEvent.click(submitButton);

    expect(await screen.findByText("Location is required")).toBeInTheDocument();
  });
});
```

## 🚀 Performance Optimization

### **Bundle Optimization**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          maps: ["@react-google-maps/api"],
          ui: ["lucide-react", "styled-components"],
        },
      },
    },
  },
});
```

### **Code Splitting**

```jsx
// Lazy loading for route components
const History = lazy(() => import("./components/History"));
const SharedAdventure = lazy(() => import("./components/SharedAdventure"));

// Usage in router
<Route
  path="/history"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <History />
    </Suspense>
  }
/>;
```

### **Image Optimization**

```jsx
// Optimized image loading
const AdventureImage = ({ src, alt, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      {loading && <ImageSkeleton />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        className={`transition-opacity ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        {...props}
      />
      {error && <ImageFallback />}
    </div>
  );
};
```

## 🚢 Deployment

### **Build Process**

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Deploy to static hosting (Netlify, Vercel, etc.)
# Build files are in dist/ directory
```

### **Environment-Specific Builds**

```bash
# Staging build
NODE_ENV=staging npm run build

# Production build
NODE_ENV=production npm run build
```

### **Docker Deployment**

```dockerfile
# Multi-stage Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Analytics & Monitoring

### **Performance Monitoring**

```jsx
// Performance tracking
const usePerformance = () => {
  useEffect(() => {
    // Track page load time
    window.addEventListener("load", () => {
      const loadTime = performance.now();
      analytics.track("page_load_time", { duration: loadTime });
    });

    // Track user interactions
    const trackInteraction = (event) => {
      analytics.track("user_interaction", {
        type: event.type,
        target: event.target.tagName,
      });
    };

    document.addEventListener("click", trackInteraction);
    return () => document.removeEventListener("click", trackInteraction);
  }, []);
};
```

### **Error Reporting**

```jsx
// Error boundary for crash reporting
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary:", error, errorInfo);
    // Send to error reporting service
    errorReporting.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## 📚 Additional Resources

- **React Documentation**: https://reactjs.org/docs
- **Vite Guide**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com/
- **Google Maps React**: https://react-google-maps-api-docs.netlify.app/

---

_Frontend crafted for exceptional user experience and developer happiness_ ✨
