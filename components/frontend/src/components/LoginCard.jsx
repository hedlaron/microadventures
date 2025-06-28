const LoginCard = ({ onSubmit, error, isLoading, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto my-auto">
        <form onSubmit={onSubmit}>
          {/* ...existing form fields... */}
          
          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};