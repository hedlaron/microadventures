import React from "react";

const ContactModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-all duration-300"
        aria-hidden="true"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      ></div>
      <div
        className="relative bg-white rounded-2xl p-4 sm:p-8 max-w-md sm:max-w-2xl w-full mx-auto shadow-xl border border-orange-200 flex flex-col gap-6 animate-fade-in contact-modal-scroll"
        style={{
          maxHeight: "90vh",
          marginTop: "16px",
          marginBottom: "16px",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          .contact-modal-scroll::-webkit-scrollbar {
            width: 12px;
          }
          .contact-modal-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #f4a261, #e76f51);
            border-radius: 8px;
          }
          .contact-modal-scroll::-webkit-scrollbar-track {
            background: #fff7ed;
            border-radius: 8px;
          }
          .contact-modal-scroll {
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
              <span role="img" aria-label="wave">
                👋
              </span>{" "}
              Áron Hédl — DevOps Engineer / Software Engineer
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              <span className="font-semibold text-orange-700">
                DevOps • CI/CD • Automation • Cloud • Infrastructure as Code •
                Monitoring
              </span>
              <br />
              <span className="text-orange-600">
                Python, Docker, Terraform, Ansible, AWS, Linux, GitHub Actions,
                Jenkins, TeamCity, PostgreSQL, Nginx, Trivy, PowerShell, Bash,
                and more.
              </span>
              <br />
              <br />
              <span className="font-semibold">What I do:</span> Build and
              automate CI/CD pipelines, manage cloud infrastructure, migrate and
              monitor services, develop internal tools, and empower teams.
              <br />
              <span className="font-semibold">Other skills:</span> React,
              FastAPI, JavaScript, SQL, Flask.
              <br />
              <span className="font-semibold">Certs:</span> BSc Business
              Informatics, Red Hat Delivery Specialist.
              <br />
              <span className="font-semibold">Languages:</span> Hungarian,
              English.
              <br />
              <br />
              <span className="text-orange-600">
                Let's connect for collaboration, consulting, or just to vibe
                about DevOps, AI, and microadventures!
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
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/hedlaron"
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
                <span>GitHub</span>
              </a>
            </div>
            <div className="mt-4 text-sm text-gray-600 bg-orange-50 rounded-lg p-3 border border-orange-100 flex items-center gap-3">
              <img
                src="/rick-rubin.jpg"
                alt="Rick Rubin vibecoding meme"
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-200 shadow"
              />
              <div>
                <span className="font-semibold text-orange-700">Fun fact:</span>{" "}
                When I code, I channel my inner Rick Rubin—minimalist, creative,
                and always vibing.{" "}
                <span className="italic">
                  (No beard required, but it helps with debugging.)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
