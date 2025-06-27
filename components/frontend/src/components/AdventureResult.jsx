import React, { useState } from 'react';
import { MapPin, Mountain, Umbrella, Sun, ArrowLeft, RotateCcw, Share2, Copy, Check } from 'lucide-react';
import { shareAdventure } from '../utils/api';

const AdventureResult = ({ adventure, onBack, onNewAdventure, quotaInfo, isSharedView = false, backText = "Back" }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState(adventure.is_public ? `/shared/${adventure.share_token}` : null);
  const [copied, setCopied] = useState(false);
  
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    // Keep the time in 24-hour format as received from backend
    return timeStr;
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await shareAdventure(adventure.id, !adventure.is_public);
      
      if (result.success) {
        if (result.share_url) {
          setShareUrl(result.share_url);
          adventure.is_public = true;
          adventure.share_token = result.share_url.split('/').pop();
        } else {
          setShareUrl(null);
          adventure.is_public = false;
        }
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      alert(error.userMessage || 'Failed to update sharing settings');
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      const fullUrl = `${window.location.origin}${shareUrl}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const getIconForActivity = (activity) => {
    const iconMap = {
      'start': MapPin,
      'hike': Mountain,
      'descend': Umbrella,
      'relax': Sun,
      'vista': Mountain,
      'view': Mountain,
      'beach': Umbrella,
      'swim': Umbrella,
      'picnic': Sun,
      'return': MapPin,
    };
    
    // Find matching icon based on activity description
    const activityLower = activity.toLowerCase();
    for (const [key, IconComponent] of Object.entries(iconMap)) {
      if (activityLower.includes(key)) {
        return IconComponent;
      }
    }
    return MapPin; // Default icon
  };

  return (
    <div className="h-full bg-[#f8fcfa] font-sans flex flex-col pb-8 overflow-y-auto">
      {/* Header - only show if not in shared view */}
      {!isSharedView && (
        <header className="border-b border-solid border-b-[#e6f4ef] bg-white z-10 flex-shrink-0">
          {/* Top row - Back button and title */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-3">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-[#46a080] hover:text-[#0c1c17] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">{backText}</span>
            </button>
            <h2 className="text-[#0c1c17] text-lg font-bold leading-tight tracking-[-0.015em]">
              Your Adventure
            </h2>
            <div className="w-24"> {/* Spacer for balance */}</div>
          </div>
          
          {/* Bottom row - Action buttons */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-2 bg-gray-50/50">
            <div className="flex items-center gap-3">
              {quotaInfo && (
                <div className="text-sm text-[#46a080] font-medium">
                  {quotaInfo.adventures_remaining} adventures left today
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Share Button */}
              <button
                onClick={handleShare}
                disabled={isSharing}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  adventure.is_public 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Share2 size={14} />
                {isSharing ? 'Updating...' : (adventure.is_public ? 'Public' : 'Share')}
              </button>
              
              {/* Copy URL Button (only show when public) */}
              {adventure.is_public && shareUrl && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Copy share link"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
              
              <button
                onClick={onNewAdventure}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#46a080] text-white rounded-lg hover:bg-[#019863] transition-colors"
              >
                <RotateCcw size={14} />
                New Adventure
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content - Properly centered card with scrollable content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f8fcfa]">
        <div className="w-full max-w-5xl max-h-[calc(100vh-160px)] flex flex-col">
          <div className="bg-white rounded-2xl shadow-xl border border-[#e6f4ef] flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Back button for shared view */}
            {isSharedView && (
              <div className="flex items-center justify-between p-4 border-b border-[#e6f4ef] bg-white">
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 text-[#46a080] hover:text-[#0c1c17] transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm font-medium">{backText}</span>
                </button>
                <button
                  onClick={onNewAdventure}
                  className="flex items-center gap-2 px-4 py-2 bg-[#46a080] text-white rounded-lg hover:bg-[#019863] transition-colors"
                >
                  <RotateCcw size={16} />
                  Create My Own
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto adventure-scroll min-h-0">
              <div className="p-6 lg:p-8">
                {/* Hero Section */}
                <div className="@container mb-6">
                  <div className="@[480px]:px-0 @[480px]:py-0">
                    <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-[#f8fcfa] rounded-xl min-h-80 relative">
                      {adventure.image_url ? (
                        <img 
                          src={adventure.image_url} 
                          alt={adventure.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#46a080] to-[#019863]"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="flex p-6 relative z-10">
                        <p className="text-white tracking-light text-[28px] font-bold leading-tight">
                          {adventure.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div className="mb-6">
                  <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                    Overview
                  </h2>
                  <p className="text-[#0c1c17] text-base font-normal leading-normal">
                    {adventure.description}
                  </p>
                </div>

                {/* Map */}
                {adventure.route && adventure.route.map_embed_url && (
                  <div className="mb-6">
                    <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                      Map & Route
                    </h2>
                    <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl">
                      {/* Open in Google Maps link */}
                      <a 
                        href={adventure.route.map_embed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full bg-gradient-to-br from-[#46a080] to-[#019863] rounded-xl flex items-center justify-center text-white hover:from-[#019863] hover:to-[#46a080] transition-all"
                      >
                        <div className="text-center">
                          <div className="text-6xl mb-4">🗺️</div>
                          <h3 className="text-xl font-bold mb-2">View Route in Google Maps</h3>
                          <p className="text-sm opacity-90">
                            {adventure.route.estimated_distance && `${adventure.route.estimated_distance} • `}
                            {adventure.route.estimated_travel_time}
                          </p>
                          <div className="mt-4 px-4 py-2 bg-white/20 rounded-lg inline-block">
                            Click to Open Route
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                )}

                {/* Weather */}
                {adventure.weather_forecast && (
                  <div className="mb-6">
                    <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                      Weather Forecast
                    </h2>
                    <div className="bg-white rounded-xl p-4 border border-[#e6f4ef]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#0c1c17] text-lg font-semibold">
                            {adventure.weather_forecast.temperature}
                          </p>
                          <p className="text-[#46a080] text-sm">
                            {adventure.weather_forecast.conditions}
                          </p>
                        </div>
                        <div className="text-right text-sm text-[#46a080]">
                          <p>UV: {adventure.weather_forecast.uv_index}</p>
                          <p>Wind: {adventure.weather_forecast.wind}</p>
                          <p>Precipitation: {adventure.weather_forecast.precipitation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Itinerary */}
                <div className="mb-6">
                  <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                    Itinerary
                  </h2>
                  <div className="grid grid-cols-[40px_1fr] gap-x-2">
                    {adventure.itinerary && adventure.itinerary.map((item, index) => {
                      const IconComponent = getIconForActivity(item.activity);
                      const isLast = index === adventure.itinerary.length - 1;
                      
                      return (
                        <React.Fragment key={index}>
                          <div className="flex flex-col items-center gap-1 pt-3">
                            <div className="text-[#0c1c17]">
                              <IconComponent size={24} />
                            </div>
                            {!isLast && <div className="w-[1.5px] bg-[#cde9df] h-2 grow"></div>}
                          </div>
                          <div className="flex flex-1 flex-col py-3">
                            <p className="text-[#0c1c17] text-base font-medium leading-normal">
                              {item.activity}
                            </p>
                            <p className="text-[#46a080] text-base font-normal leading-normal">
                              {formatTime(item.time)}
                            </p>
                            {item.location && (
                              <p className="text-[#46a080] text-sm font-normal leading-normal">
                                📍 {item.location}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-[#0c1c17] text-sm font-normal leading-normal mt-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Packing List */}
                <div className="mb-6">
                  <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                    Packing List
                  </h2>
                  <div>
                    {adventure.packing_list && (
                      <>
                        {adventure.packing_list.essential && adventure.packing_list.essential.map((item, index) => (
                          <label key={`essential-${index}`} className="flex gap-x-3 py-3 flex-row">
                            <input
                              type="checkbox"
                              className="h-5 w-5 rounded border-[#cde9df] border-2 bg-transparent text-[#019863] checked:bg-[#019863] checked:border-[#019863] focus:ring-0 focus:ring-offset-0 focus:border-[#cde9df] focus:outline-none"
                            />
                            <p className="text-[#0c1c17] text-base font-normal leading-normal">
                              {item} <span className="text-[#46a080] text-sm">(Essential)</span>
                            </p>
                          </label>
                        ))}
                        {adventure.packing_list.weather_specific && adventure.packing_list.weather_specific.map((item, index) => (
                          <label key={`weather-${index}`} className="flex gap-x-3 py-3 flex-row">
                            <input
                              type="checkbox"
                              className="h-5 w-5 rounded border-[#cde9df] border-2 bg-transparent text-[#019863] checked:bg-[#019863] checked:border-[#019863] focus:ring-0 focus:ring-offset-0 focus:border-[#cde9df] focus:outline-none"
                            />
                            <p className="text-[#0c1c17] text-base font-normal leading-normal">
                              {item} <span className="text-[#46a080] text-sm">(Weather)</span>
                            </p>
                          </label>
                        ))}
                        {adventure.packing_list.optional && adventure.packing_list.optional.map((item, index) => (
                          <label key={`optional-${index}`} className="flex gap-x-3 py-3 flex-row">
                            <input
                              type="checkbox"
                              className="h-5 w-5 rounded border-[#cde9df] border-2 bg-transparent text-[#019863] checked:bg-[#019863] checked:border-[#019863] focus:ring-0 focus:ring-offset-0 focus:border-[#cde9df] focus:outline-none"
                            />
                            <p className="text-[#0c1c17] text-base font-normal leading-normal">
                              {item} <span className="text-[#46a080] text-sm">(Optional)</span>
                            </p>
                          </label>
                        ))}
                        {adventure.packing_list.food_and_drink && adventure.packing_list.food_and_drink.map((item, index) => (
                          <label key={`food-${index}`} className="flex gap-x-3 py-3 flex-row">
                            <input
                              type="checkbox"
                              className="h-5 w-5 rounded border-[#cde9df] border-2 bg-transparent text-[#019863] checked:bg-[#019863] checked:border-[#019863] focus:ring-0 focus:ring-offset-0 focus:border-[#cde9df] focus:outline-none"
                            />
                            <p className="text-[#0c1c17] text-base font-normal leading-normal">
                              {item} <span className="text-[#46a080] text-sm">(Food & Drink)</span>
                            </p>
                          </label>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Recommendations */}
                {(adventure.recommendations) && (
                  <div className="mb-6">
                    <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                      Additional Recommendations
                    </h2>
                    <div className="bg-white rounded-xl p-6 border border-[#e6f4ef] space-y-6">
                      {adventure.recommendations.photo_opportunities && (
                        <div>
                          <h3 className="text-[#0c1c17] text-lg font-semibold mb-3 flex items-center gap-2">
                            📸 Photo Opportunities
                          </h3>
                          <ul className="text-[#0c1c17] text-sm space-y-2">
                            {adventure.recommendations.photo_opportunities.map((spot, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-[#46a080] mt-1">•</span>
                                <span>{spot}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {adventure.recommendations.local_tips && (
                        <div>
                          <h3 className="text-[#0c1c17] text-lg font-semibold mb-3 flex items-center gap-2">
                            💡 Local Tips
                          </h3>
                          <ul className="text-[#0c1c17] text-sm space-y-2">
                            {adventure.recommendations.local_tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-[#46a080] mt-1">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {adventure.recommendations.hidden_gems && (
                        <div>
                          <h3 className="text-[#0c1c17] text-lg font-semibold mb-3 flex items-center gap-2">
                            💎 Hidden Gems
                          </h3>
                          <ul className="text-[#0c1c17] text-sm space-y-2">
                            {adventure.recommendations.hidden_gems.map((gem, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-[#46a080] mt-1">•</span>
                                <span>{gem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Share Section - Only show for non-shared views */}
                {!isSharedView && (
                  <div className="mb-6">
                    <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                      Share Your Adventure
                    </h2>
                    <div className="bg-white rounded-xl p-4 border border-[#e6f4ef] flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <p className="text-[#0c1c17] text-base font-normal leading-normal mb-2">
                          {adventure.is_public 
                            ? 'Your adventure is public! Anyone with the link can view it.' 
                            : 'Your adventure is private. Share it with others by making it public.'}
                        </p>
                        {shareUrl && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={`${window.location.origin}${shareUrl}`}
                              readOnly
                              className="flex-1 p-2 border border-[#cde9df] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#46a080] focus:border-transparent"
                            />
                            <button
                              onClick={copyToClipboard}
                              className="px-4 py-2 bg-[#46a080] text-white rounded-lg hover:bg-[#019863] transition-colors flex items-center gap-2"
                            >
                              {copied ? <Check size={16} /> : <Copy size={16} />}
                              {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all 
                          ${adventure.is_public ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#46a080] text-white hover:bg-[#019863]'}
                          ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSharing ? (
                          <>
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"></path>
                            </svg>
                            {adventure.is_public ? 'Making Private...' : 'Making Public...'}
                          </>
                        ) : (
                          <>
                            <Share2 size={16} />
                            {adventure.is_public ? 'Make Private' : 'Share Adventure'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventureResult;
