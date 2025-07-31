import React, { useState, useEffect } from "react";

const About = ({ onClose }) => {
  const [backendVersion, setBackendVersion] = useState("Loading...");
  const [frontendVersion, setFrontendVersion] = useState("dev-local");

  useEffect(() => {
    const fetchBackendVersion = async () => {
      try {
        const response = await fetch("/backend/api/version");
        if (response.ok) {
          const data = await response.json();
          setBackendVersion(data.version || "unknown");
        } else {
          console.log(
            `Version API returned ${response.status}: ${response.statusText}`,
          );
          setBackendVersion("api-error");
        }
      } catch (error) {
        console.log("Version API not available:", error.message);
        setBackendVersion("api-unavailable");
      }
    };

    // Check if we're in production environment
    const isProduction =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1" &&
      window.location.hostname !== "0.0.0.0";

    console.log("Environment detection:", {
      hostname: window.location.hostname,
      isProduction,
      origin: window.location.origin,
    });

    if (isProduction) {
      // In production, get frontend version from build-time environment variable
      const buildTimeVersion = import.meta.env.VITE_APP_VERSION || "unknown";
      setFrontendVersion(buildTimeVersion);
      fetchBackendVersion();
    } else {
      // Local development
      setFrontendVersion("dev-local");
      setBackendVersion("dev-local");
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-all duration-300"
        aria-hidden="true"
        data-testid="about-backdrop"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      ></div>
      <div
        className="relative bg-white rounded-2xl p-6 max-w-6xl w-full mx-4 shadow-xl border border-orange-200 flex flex-col gap-6 animate-fade-in about-modal-scroll"
        style={{
          maxHeight: "92vh",
          marginTop: "32px",
          marginBottom: "32px",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          .about-modal-scroll::-webkit-scrollbar {
            width: 12px;
          }
          .about-modal-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #f4a261, #e76f51);
            border-radius: 8px;
          }
          .about-modal-scroll::-webkit-scrollbar-track {
            background: #fff7ed;
            border-radius: 8px;
          }
          .about-modal-scroll {
            scrollbar-color: #f4a261 #fff7ed;
            scrollbar-width: thin;
          }
        `}</style>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none z-50 p-0 m-0 bg-transparent border-none"
          aria-label="Close"
          style={{ zIndex: 100 }}
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 flex flex-col gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-orange-700 tracking-tight flex items-center gap-2">
              <span role="img" aria-label="rocket">
                🚀
              </span>{" "}
              Microadventures
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              <span className="font-semibold text-orange-700">
                Microadventures
              </span>{" "}
              is an{" "}
              <span className="font-semibold">
                AI-powered trip planning platform
              </span>{" "}
              for discovering short, exciting adventures tailored to your
              location, time, and weather.
              <br />
              <span className="text-orange-600">
                A modern, cloud-native portfolio project demonstrating best
                practices in full-stack development, DevOps, and cloud
                infrastructure.
              </span>
            </p>
            <div className="mt-2 flex flex-row gap-3">
              <a
                href="https://www.linkedin.com/in/hedlaron/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium text-sm transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="inline-block align-middle"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2 3.6 4.594v5.602z" />
                </svg>
                <span>Let's connect on LinkedIn</span>
              </a>
              <a
                href="https://github.com/hedlaron/microadventures"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium text-sm transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="inline-block align-middle"
                >
                  <path d="M12 0C5.371 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577 0-.285-.011-1.04-.017-2.042-3.338.726-4.042-1.611-4.042-1.611-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.625-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.192.694.801.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub Repo</span>
              </a>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 bg-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm">
            <h3 className="font-semibold text-orange-800 mb-2 text-lg flex items-center gap-2">
              <span role="img" aria-label="stack">
                🛠️
              </span>{" "}
              Technology Stack
            </h3>
            <ul className="list-disc list-inside text-base text-gray-800 space-y-1">
              <li>
                <span className="font-semibold">Frontend:</span> React 19, Vite,
                Tailwind CSS, Styled Components, Leaflet, Axios, Lucide React
              </li>
              <li>
                <span className="font-semibold">Backend:</span> FastAPI (Python
                3.13), PostgreSQL, SQLAlchemy, Alembic, Pydantic, JWT, Uvicorn
              </li>
              <li>
                <span className="font-semibold">AI Integration:</span> OpenAI,
                Anthropic Sonnet 4, GPT-4.1, Gemini 2.5
              </li>
              <li>
                <span className="font-semibold">DevOps & Cloud:</span> Docker,
                Kubernetes (K8s), GKE, Kluctl (GitOps), Devbox, Task, GitHub
                Actions, Trivy, Cloudflare
              </li>
              <li>
                <span className="font-semibold">Testing & Quality:</span>{" "}
                Vitest, Pytest, Pre-commit, Ruff, ESLint, Prettier
              </li>
            </ul>
            <div className="mt-3 text-sm text-gray-600">
              <span role="img" aria-label="bulb">
                💡
              </span>{" "}
              <span className="font-medium">Why this stack?</span> <br />
              This project leverages the latest in frontend, backend, and
              cloud-native technologies to deliver a fast, secure, and
              delightful user experience. Every layer is designed for
              scalability, maintainability, and developer happiness.
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1 bg-orange-50 rounded-xl p-5 border border-orange-100 shadow-sm">
            <h3 className="font-semibold text-orange-800 mb-2 text-base flex items-center gap-2">
              <span role="img" aria-label="star">
                ✨
              </span>{" "}
              Key Features
            </h3>
            <ul className="list-disc list-inside text-base text-gray-800 space-y-1">
              <li>🤖 AI-powered personalized adventure recommendations</li>
              <li>🗺️ Interactive maps and real-time weather integration</li>
              <li>📱 Responsive, mobile-first design</li>
              <li>🔒 Secure authentication and user history</li>
              <li>☁️ Cloud-native, production-ready infrastructure</li>
            </ul>
          </div>
          <div className="flex-1 flex flex-col gap-3 justify-end">
            <div className="flex flex-row gap-4">
              <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <span className="block text-xs text-gray-500 mb-1 font-medium">
                  Frontend Version
                </span>
                <span className="font-mono text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                  {frontendVersion}
                </span>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <span className="block text-xs text-gray-500 mb-1 font-medium">
                  Backend Version
                </span>
                <span className="font-mono text-xs bg-green-50 text-green-800 px-2 py-1 rounded">
                  {backendVersion}
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400 text-right">
              Version info is for troubleshooting and support.
            </div>
          </div>
        </div>
        {/* No bottom close button for compactness */}
      </div>
    </div>
  );
};

export default About;
