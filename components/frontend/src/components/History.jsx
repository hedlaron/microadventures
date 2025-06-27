import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserAdventures, shareAdventure } from '../utils/api';
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const History = ({ onBack, onSelectAdventure }) => {
  const { currentUser } = useAuth();
  const [adventures, setAdventures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sharingStates, setSharingStates] = useState({}); // Track sharing state per adventure
  const [copiedStates, setCopiedStates] = useState({}); // Track copied state per adventure
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Show 6 adventures per page (3x2 grid)

  useEffect(() => {
    loadAdventures();
  }, []);

  const loadAdventures = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (token) {
        const userAdventures = await fetchUserAdventures(token);
        setAdventures(userAdventures);
      }
    } catch (err) {
      console.error('Failed to load adventures:', err);
      setError('Failed to load your adventure history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (duration) => {
    // Convert duration from backend format to display format
    const durationMap = {
      'few-hours': 'Few Hours',
      'half-day': 'Half Day',
      'full-day': 'Full Day',
      'few-days': 'Few Days'
    };
    return durationMap[duration] || duration;
  };

  const handleShare = async (e, adventure) => {
    e.stopPropagation(); // Prevent card click
    
    setSharingStates(prev => ({ ...prev, [adventure.id]: true }));
    
    try {
      const result = await shareAdventure(adventure.id, !adventure.is_public);
      
      if (result.success) {
        // Update the adventure in the list
        setAdventures(prev => prev.map(adv => 
          adv.id === adventure.id 
            ? { 
                ...adv, 
                is_public: !adventure.is_public,
                share_token: result.share_url ? result.share_url.split('/').pop() : null
              }
            : adv
        ));
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      alert(error.userMessage || 'Failed to update sharing settings');
    } finally {
      setSharingStates(prev => ({ ...prev, [adventure.id]: false }));
    }
  };

  const handleCopyLink = async (e, adventure) => {
    e.stopPropagation(); // Prevent card click
    
    if (!adventure.share_token) return;
    
    try {
      const shareUrl = `${window.location.origin}/shared/${adventure.share_token}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedStates(prev => ({ ...prev, [adventure.id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [adventure.id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(adventures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdventures = adventures.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll to top of the adventure list
    document.querySelector('.adventure-grid')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fcfa] font-sans">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6f4ef] px-6 sm:px-10 py-3 bg-white">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#46a080] hover:text-[#0c1c17] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h2 className="text-[#0c1c17] text-lg font-bold leading-tight tracking-[-0.015em]">
            Adventure History
          </h2>
          <div></div>
        </header>
        
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46a080] mx-auto mb-4"></div>
            <p className="text-[#46a080] text-lg">Loading your adventures...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fcfa] font-sans">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6f4ef] px-6 sm:px-10 py-3 bg-white">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#46a080] hover:text-[#0c1c17] transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h2 className="text-[#0c1c17] text-lg font-bold leading-tight tracking-[-0.015em]">
          Adventure History
        </h2>
        <div></div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="px-6 sm:px-40 h-full flex justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 min-h-0">
            {error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={loadAdventures}
                    className="px-4 py-2 bg-[#46a080] text-white rounded-lg hover:bg-[#019863] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : adventures.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-xl p-8 border border-[#e6f4ef] max-w-md mx-auto">
                  <div className="text-[#46a080] mb-4">
                    <MapPin size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-[#0c1c17] text-xl font-bold mb-2">
                    No Adventures Yet
                  </h3>
                  <p className="text-[#46a080] mb-6">
                    You haven't created any adventures yet. Start planning your first microadventure!
                  </p>
                  <button
                    onClick={onBack}
                    className="px-6 py-2 bg-[#46a080] text-white rounded-lg hover:bg-[#019863] transition-colors"
                  >
                    Plan Your First Adventure
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full min-h-0">
                {/* Header with pagination info */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h1 className="text-[#0c1c17] text-2xl font-bold">
                    Your Adventures ({adventures.length})
                  </h1>
                  {totalPages > 1 && (
                    <div className="text-sm text-[#46a080]">
                      Page {currentPage} of {totalPages}
                    </div>
                  )}
                </div>
                
                {/* Adventure Grid - Scrollable */}
                <div className="flex-1 overflow-y-auto adventure-scroll min-h-0">
                  <div className="adventure-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-6">
                    {currentAdventures.map((adventure) => (
                      <div
                        key={adventure.id}
                        onClick={() => onSelectAdventure(adventure)}
                        className="bg-white rounded-xl overflow-hidden border border-[#e6f4ef] hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-[#46a080] to-[#019863]">
                          {adventure.image_url && (
                            <img 
                              src={adventure.image_url} 
                              alt={adventure.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                          
                          {/* Share controls at top */}
                          <div className="absolute top-3 right-3 flex items-center gap-2">
                            {/* Share/Unshare button */}
                            <button
                              onClick={(e) => handleShare(e, adventure)}
                              disabled={sharingStates[adventure.id]}
                              className={`
                                flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                transition-all duration-200 shadow-sm
                                ${adventure.is_public 
                                  ? 'bg-green-500 text-white hover:bg-green-600' 
                                  : 'bg-white/90 text-gray-700 hover:bg-white'
                                }
                                ${sharingStates[adventure.id] ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'}
                              `}
                              title={adventure.is_public ? 'Make Private' : 'Share Publicly'}
                            >
                              <Share2 size={12} />
                              <span>{adventure.is_public ? 'Shared' : 'Share'}</span>
                            </button>
                            
                            {/* Copy link button (only when public) */}
                            {adventure.is_public && (
                              <button
                                onClick={(e) => handleCopyLink(e, adventure)}
                                className={`
                                  flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                  transition-all duration-200 shadow-sm
                                  ${copiedStates[adventure.id] 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'
                                  }
                                `}
                                title="Copy Share Link"
                              >
                                {copiedStates[adventure.id] ? (
                                  <>
                                    <Check size={12} />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-[#FFD166] transition-colors">
                              {adventure.title}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <p className="text-[#0c1c17] text-sm leading-relaxed mb-4 line-clamp-2">
                            {adventure.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-[#46a080]">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatDate(adventure.created_at)}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{formatDuration(adventure.duration)}</span>
                            </div>
                          </div>
                          
                          {adventure.location && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-[#46a080]">
                              <MapPin size={14} />
                              <span className="truncate">{adventure.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#e6f4ef] flex-shrink-0">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-[#e6f4ef] text-[#46a080] hover:bg-[#f8fcfa]'
                      }`}
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-[#46a080] text-white'
                              : 'bg-white border border-[#e6f4ef] text-[#46a080] hover:bg-[#f8fcfa]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-[#e6f4ef] text-[#46a080] hover:bg-[#f8fcfa]'
                      }`}
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;