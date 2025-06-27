import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import History from './History';
import AdventureResult from './AdventureResult';

const HistoryPage = () => {
  const [selectedAdventure, setSelectedAdventure] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => {
    if (selectedAdventure) {
      setSelectedAdventure(null);
    } else {
      navigate('/');
    }
  };

  const handleSelectAdventure = (adventure) => {
    setSelectedAdventure(adventure);
  };

  const handleNewAdventure = () => {
    navigate('/plan');
  };

  if (selectedAdventure) {
    return (
      <AdventureResult
        adventure={selectedAdventure}
        onBack={handleBack}
        onNewAdventure={handleNewAdventure}
        quotaInfo={null} // We don't need quota info in history view
        backText="Back to History"
      />
    );
  }

  return (
    <History
      onBack={handleBack}
      onSelectAdventure={handleSelectAdventure}
    />
  );
};

export default HistoryPage;
