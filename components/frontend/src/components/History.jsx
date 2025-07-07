import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserAdventures, shareAdventure } from '../utils/api';
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cardAccent, cardAccentSecondary, errorText, errorBg, brandGradient, brandGradientHover } from '../utils/colors';

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100/50 font-sans">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-orange-200/50 px-6 sm:px-10 py-4 bg-white">
          <button 
            onClick={onBack}
            style={{ padding: '0.75rem 1.25rem', height: '3rem', borderRadius: '0.75rem' }}
            className="flex items-center gap-2 text-orange-600 hover:text-white hover:bg-gradient-to-r hover:from-[#F4A261] hover:to-[#E76F51] transition-all duration-200 border-2 border-orange-300 font-medium"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h2 className="text-[#0c1c17] text-lg font-bold leading-tight tracking-[-0.015em]">
            Adventure History
          </h2>
          <div></div>
        </header>
        
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100/50 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-orange-200/50 px-6 sm:px-10 py-3 bg-white">
        <button 
          onClick={onBack}
          style={{ padding: '0.5rem 1rem', height: '2.5rem' }}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors"
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
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-orange-700 mb-4">{error}</p>
                  <button
                    onClick={loadAdventures}
                    className="px-4 py-2 bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white rounded-lg hover:from-[#E76F51] hover:to-[#D84B40] transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : adventures.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-xl p-8 border border-orange-200/50 max-w-md mx-auto">
                  <div className="text-orange-500 mb-4">
                    <MapPin size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-[#0c1c17] text-xl font-bold mb-2">
                    No Adventures Yet
                  </h3>
                  <p className="text-orange-600 mb-6">
                    You haven't created any adventures yet. Start planning your first microadventure!
                  </p>
                  <button
                    onClick={onBack}
                    className="px-6 py-2 bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white rounded-lg hover:from-[#E76F51] hover:to-[#D84B40] transition-all"
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
                    <div className="text-sm text-gray-600">
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
                        className="bg-white rounded-xl overflow-hidden border border-orange-200/50 hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-[#F4A261] to-[#E76F51]">
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
                                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                transition-all duration-200 shadow-lg backdrop-blur-sm
                                ${adventure.is_public 
                                  ? 'bg-brand-400/90 text-white hover:bg-brand-500 border border-brand-300/50' 
                                  : 'bg-white/90 text-gray-700 hover:bg-white border border-white/50'
                                }
                                ${sharingStates[adventure.id] ? 'opacity-75 cursor-not-allowed' : 'hover:brightness-110 hover:shadow-xl'}
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
                                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                  transition-all duration-200 shadow-lg backdrop-blur-sm
                                  ${copiedStates[adventure.id] 
                                    ? 'bg-brand-500/90 text-white border border-brand-400/50' 
                                    : 'bg-white/90 text-gray-700 hover:bg-white hover:brightness-110 hover:shadow-xl border border-white/50'
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
                            <h3 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-orange-100 transition-colors">
                              {adventure.title}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <p className="text-[#0c1c17] text-sm leading-relaxed mb-4 line-clamp-2">
                            {adventure.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-green-600">
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
                            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
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
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
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
                          className={`w-11 h-11 rounded-lg font-semibold transition-all duration-200 ${
                            page === currentPage
                              ? 'bg-gray-800 text-white shadow-md scale-105'
                              : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:brightness-110'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
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