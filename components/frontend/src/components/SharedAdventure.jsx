import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedAdventure } from '../utils/api';
import AdventureResult from './AdventureResult';

const SharedAdventure = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [adventure, setAdventure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedAdventure = async () => {
      try {
        setLoading(true);
        const adventureData = await getSharedAdventure(shareToken);
        setAdventure(adventureData);
      } catch (err) {
        setError(err.userMessage || 'Failed to load shared adventure');
        console.error('Error fetching shared adventure:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shareToken) {
      fetchSharedAdventure();
    }
  }, [shareToken]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleCreateOwn = () => {
    navigate('/plan');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fcfa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46a080] mx-auto mb-4"></div>
          <p className="text-[#0c1c17]">Loading shared adventure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fcfa] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold text-[#0c1c17] mb-4">Adventure Not Found</h1>
          <p className="text-[#46a080] mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleBackToHome}
              className="w-full px-6 py-3 bg-[#46a080] text-white rounded-lg hover:bg-[#019863] transition-colors"
            >
              Go to Homepage
            </button>
            <button
              onClick={handleCreateOwn}
              className="w-full px-6 py-3 border border-[#46a080] text-[#46a080] rounded-lg hover:bg-[#46a080] hover:text-white transition-colors"
            >
              Create Your Own Adventure
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!adventure) {
    return null;
  }

  // Render the adventure with modified props for shared view
  return (
    <AdventureResult
      adventure={adventure}
      onBack={handleBackToHome}
      onNewAdventure={handleCreateOwn}
      quotaInfo={null} // No quota info for shared view
      isSharedView={true} // Add prop to disable sharing for shared adventures
      backText="Back to Home"
    />
  );
};

export default SharedAdventure;
