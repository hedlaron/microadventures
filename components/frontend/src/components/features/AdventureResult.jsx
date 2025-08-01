import { List } from "lucide-react";

import React, { useState, useMemo } from "react";
import ReactMemo from "react";
import LeafletRouteMapOrig from "../ui/LeafletRouteMap";

// Custom deep compare for map props
function deepEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === "object" && typeof b === "object" && a && b) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let key of keysA) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

const LeafletRouteMap = ReactMemo.memo(
  LeafletRouteMapOrig,
  (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps);
  },
);
import {
  MapPin,
  Mountain,
  Umbrella,
  Sun,
  ArrowLeft,
  RotateCcw,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { shareAdventure } from "../../utils/api";
import {
  primaryButtonRounded as _PRIMARY_BUTTON_ROUNDED,
  brandGradient as _BRAND_GRADIENT,
  brandGradientHover as _BRAND_GRADIENT_HOVER,
  cardAccent as _CARD_ACCENT,
  cardAccentSecondary as _CARD_ACCENT_SECONDARY,
  focusRing as _FOCUS_RING,
} from "../../utils/colors";

const AdventureResult = ({
  adventure,
  onBack,
  onNewAdventure,
  quotaInfo,
  isSharedView = false,
  backText = "Back",
  onAdventureUpdate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState(
    adventure.is_public ? `/shared/${adventure.share_token}` : null,
  );

  const [copied, setCopied] = useState(false);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    // Convert ISO/UTC time to user's local time in readable format
    const date = new Date(timeStr);
    if (isNaN(date)) return timeStr;
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await shareAdventure(adventure.id, !adventure.is_public);
      if (result.success) {
        if (result.share_url) {
          setShareUrl(result.share_url);
          if (onAdventureUpdate) {
            onAdventureUpdate({
              ...adventure,
              is_public: true,
              share_token: result.share_url.split("/").pop(),
            });
          }
        } else {
          setShareUrl(null);
          if (onAdventureUpdate) {
            onAdventureUpdate({
              ...adventure,
              is_public: false,
            });
          }
        }
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      alert(error.userMessage || "Failed to update sharing settings");
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
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const getIconForActivity = (activity) => {
    const iconMap = {
      start: MapPin,
      hike: Mountain,
      descend: Umbrella,
      relax: Sun,
      vista: Mountain,
      view: Mountain,
      beach: Umbrella,
      swim: Umbrella,
      picnic: Sun,
      return: MapPin,
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

  // Memoize the route object

  // Use useMemo for route, start, end
  const memoRoute = useMemo(() => adventure.route, [adventure.route]);
  const startRaw =
    memoRoute?.start || memoRoute?.start_coords || memoRoute?.start_address;
  const endRaw =
    memoRoute?.destination ||
    memoRoute?.end_coordinates ||
    memoRoute?.end_address;
  const start = useMemo(() => startRaw, [startRaw]);
  const end = useMemo(() => endRaw, [endRaw]);

  // Memoize all map props to prevent rerender
  const mapProps = useMemo(
    () => ({
      start,
      end,
      startLabel:
        adventure.route?.start_label ||
        adventure.route?.start_address ||
        "Start",
      endLabel:
        adventure.route?.destination_label ||
        adventure.route?.end_address ||
        "Destination",
    }),
    [
      start,
      end,
      adventure.route?.start_label,
      adventure.route?.start_address,
      adventure.route?.destination_label,
      adventure.route?.end_address,
    ],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100/50 font-sans flex flex-col overflow-hidden">
      {/* Mobile Hamburger Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-orange-200">
            <h2 className="text-xl font-bold text-[#0c1c17]">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl text-orange-500 font-bold"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-4 p-4">
            {quotaInfo && (
              <div className="text-sm text-orange-600 font-medium">
                {quotaInfo.adventures_remaining} left today
              </div>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleShare();
              }}
              disabled={isSharing}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-200 ${
                adventure.is_public
                  ? "bg-success-100 text-success-700 hover:bg-success-200"
                  : "bg-brand-100/50 text-brand-700 hover:bg-brand-200/70"
              } ${isSharing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Share2 size={16} />
              {isSharing ? "..." : adventure.is_public ? "Public" : "Share"}
            </button>
            {adventure.is_public && shareUrl && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  copyToClipboard();
                }}
                className="flex items-center gap-2 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors duration-200 px-4 py-2 rounded-xl"
                title="Copy share link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNewAdventure();
              }}
              className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-[#F4A261] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D84B40] text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:brightness-110 border-0 rounded-xl px-4 py-2"
            >
              <RotateCcw size={16} />
              New Adventure
            </button>
            {/* Remove user avatar from mobile menu drawer */}
          </div>
        </div>
      </div>
      {/* Header - only show if not in shared view */}
      {!isSharedView && (
        <header className="border-b border-brand-200/50 bg-white z-10 flex-shrink-0">
          {/* Top row - Back button and title, mobile: compact, desktop: full */}
          <div className="flex items-center justify-between px-2 sm:px-6 py-4">
            {/* Mobile: title, avatar, hamburger. Desktop: back button, title, spacer. */}
            <div className="flex items-center justify-between w-full">
              {/* Desktop: back button */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-[#0c1c17] bg-brand-100/50 hover:bg-brand-200/70 transition-colors duration-200 px-4 py-2 rounded-xl font-medium"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm">{backText}</span>
                </button>
              </div>
              {/* Title always visible */}
              <h2 className="text-[#0c1c17] text-xl font-bold leading-tight mx-auto sm:mx-0">
                Your Adventure
              </h2>
              {/* Mobile: avatar and hamburger, Desktop: spacer */}
              <div className="flex items-center">
                {/* Show avatar only on mobile, always visible */}
                <div className="sm:hidden flex items-center ml-2">
                  {adventure.user && (
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F4A261] to-[#E76F51] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {adventure.user?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 rounded-xl text-[#F4A261] hover:bg-orange-100 focus:outline-none ml-2"
                    aria-label="Open menu"
                  >
                    <List size={28} />
                  </button>
                </div>
                <div className="hidden sm:block w-24">
                  {" "}
                  {/* Spacer for balance */}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop action buttons, hidden on mobile */}
          <div className="hidden sm:flex items-center justify-between px-2 sm:px-6 py-3 bg-orange-100/30 border-t border-orange-200/50">
            <div className="flex items-center gap-3">
              {quotaInfo && (
                <div className="text-sm text-orange-600 font-medium">
                  {quotaInfo.adventures_remaining} adventures left today
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Share Button */}
              <button
                onClick={handleShare}
                disabled={isSharing}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-200 ${
                  adventure.is_public
                    ? "bg-success-100 text-success-700 hover:bg-success-200"
                    : "bg-brand-100/50 text-brand-700 hover:bg-brand-200/70"
                } ${isSharing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Share2 size={16} />
                {isSharing
                  ? "Updating..."
                  : adventure.is_public
                    ? "Public"
                    : "Share"}
              </button>
              {/* Copy URL Button (only show when public) */}
              {adventure.is_public && shareUrl && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors duration-200 px-4 py-2 rounded-xl"
                  title="Copy share link"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
              <button
                onClick={onNewAdventure}
                className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-[#F4A261] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D84B40] text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:brightness-110 border-0 rounded-xl px-4 py-2"
              >
                <RotateCcw size={16} />
                New Adventure
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content - Properly centered card with scrollable content */}
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 lg:px-6 min-h-0 w-full">
        <div className="w-full max-w-4xl h-full flex flex-col mx-auto">
          <div className="bg-white rounded-xl border border-orange-200/50 flex-1 overflow-hidden flex flex-col min-h-0 w-full mx-auto px-2">
            {/* Back button for shared view */}
            {isSharedView && (
              <div className="flex items-center justify-between p-2 sm:p-4 lg:p-6 border-b border-orange-200/50 bg-orange-100/30 flex-shrink-0">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-[#0c1c17] bg-orange-100/50 hover:bg-orange-200/70 transition-colors duration-200 px-4 py-2 rounded-xl font-medium"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm">{backText}</span>
                </button>
                <button
                  onClick={onNewAdventure}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white hover:from-[#E76F51] hover:to-[#D84B40] transition-all duration-200 px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl"
                >
                  <RotateCcw size={18} />
                  Create My Own
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto adventure-scroll min-h-0">
              <div className="p-2 sm:p-4 lg:p-6">
                {/* Hero Section */}
                <div className="mb-8">
                  <div className="px-0 py-0">
                    <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl min-h-48 sm:min-h-80 relative border border-orange-200/50">
                      {adventure.image_url ? (
                        <img
                          src={adventure.image_url}
                          alt={adventure.title}
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200/50 rounded-xl"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl"></div>
                      <div className="flex p-6 relative z-10">
                        <p className="text-white tracking-light text-[28px] font-bold leading-tight drop-shadow-lg">
                          {adventure.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div className="mb-8">
                  <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                    Overview
                  </h2>
                  <p className="text-[#0c1c17] text-base font-normal leading-relaxed">
                    {adventure.description}
                  </p>
                </div>

                {/* Map */}
                {adventure.route && start && end && (
                  <div className="mb-8">
                    <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                      Map
                    </h2>
                    <div
                      className="w-full aspect-video rounded-xl border border-orange-200/50 overflow-hidden mb-2 bg-white"
                      style={{
                        position: "relative",
                        zIndex: 1,
                        maxHeight: 400,
                        minHeight: 180,
                      }}
                    >
                      <div className="w-full h-full">
                        <LeafletRouteMap {...mapProps} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Weather */}
                {adventure.weather_forecast && (
                  <div className="mb-8">
                    <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                      Weather Forecast
                    </h2>
                    <div className="bg-white rounded-xl p-4 border border-orange-200/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#0c1c17] text-lg font-semibold">
                            {adventure.weather_forecast.temperature}
                          </p>
                          <p className="text-green-600 text-sm">
                            {adventure.weather_forecast.conditions}
                          </p>
                        </div>
                        <div className="text-right text-sm text-green-600">
                          <p>UV: {adventure.weather_forecast.uv_index}</p>
                          <p>Wind: {adventure.weather_forecast.wind}</p>
                          <p>
                            Precipitation:{" "}
                            {adventure.weather_forecast.precipitation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Itinerary */}
                <div className="mb-8">
                  <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                    Itinerary
                  </h2>
                  <div className="grid grid-cols-[40px_1fr] gap-x-2">
                    {adventure.itinerary &&
                      adventure.itinerary.map((item, index) => {
                        const IconComponent = getIconForActivity(item.activity);
                        const isLast = index === adventure.itinerary.length - 1;

                        return (
                          <React.Fragment key={index}>
                            <div className="flex flex-col items-center gap-1 pt-3">
                              <div className="text-[#0c1c17]">
                                <IconComponent size={24} />
                              </div>
                              {!isLast && (
                                <div className="w-[1.5px] bg-orange-200 h-2 grow"></div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col py-3">
                              <p className="text-[#0c1c17] text-base font-medium leading-normal">
                                {item.activity}
                              </p>
                              <p className="text-green-600 text-base font-normal leading-normal">
                                {formatTime(item.time)}
                              </p>
                              {item.location && (
                                <p className="text-green-600 text-sm font-normal leading-normal">
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
                <div className="mb-8">
                  <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                    Packing List
                  </h2>
                  <div>
                    {adventure.packing_list && (
                      <>
                        {adventure.packing_list.essential &&
                          adventure.packing_list.essential.map(
                            (item, index) => (
                              <label
                                key={`essential-${index}`}
                                className="flex gap-x-3 py-3 flex-row"
                              >
                                <input
                                  type="checkbox"
                                  className="h-5 w-5 rounded border-orange-200 border-2 bg-transparent text-orange-600 checked:bg-orange-600 checked:border-orange-600 focus:ring-0 focus:ring-offset-0 focus:border-orange-200 focus:outline-none"
                                />
                                <p className="text-[#0c1c17] text-base font-normal leading-normal">
                                  {item}
                                </p>
                              </label>
                            ),
                          )}
                        {adventure.packing_list.weather_specific &&
                          adventure.packing_list.weather_specific.map(
                            (item, index) => (
                              <label
                                key={`weather-${index}`}
                                className="flex gap-x-3 py-3 flex-row"
                              >
                                <input
                                  type="checkbox"
                                  className="h-5 w-5 rounded border-orange-200 border-2 bg-transparent text-orange-600 checked:bg-orange-600 checked:border-orange-600 focus:ring-0 focus:ring-offset-0 focus:border-orange-200 focus:outline-none"
                                />
                                <p className="text-[#0c1c17] text-base font-normal leading-normal">
                                  {item}
                                </p>
                              </label>
                            ),
                          )}
                        {adventure.packing_list.optional &&
                          adventure.packing_list.optional.map((item, index) => (
                            <label
                              key={`optional-${index}`}
                              className="flex gap-x-3 py-3 flex-row"
                            >
                              <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-orange-200 border-2 bg-transparent text-orange-600 checked:bg-orange-600 checked:border-orange-600 focus:ring-0 focus:ring-offset-0 focus:border-orange-200 focus:outline-none"
                              />
                              <p className="text-[#0c1c17] text-base font-normal leading-normal">
                                {item}
                              </p>
                            </label>
                          ))}
                        {adventure.packing_list.food_and_drink &&
                          adventure.packing_list.food_and_drink.map(
                            (item, index) => (
                              <label
                                key={`food-${index}`}
                                className="flex gap-x-3 py-3 flex-row"
                              >
                                <input
                                  type="checkbox"
                                  className="h-5 w-5 rounded border-orange-200 border-2 bg-transparent text-orange-600 checked:bg-orange-600 checked:border-orange-600 focus:ring-0 focus:ring-offset-0 focus:border-orange-200 focus:outline-none"
                                />
                                <p className="text-[#0c1c17] text-base font-normal leading-normal">
                                  {item}
                                </p>
                              </label>
                            ),
                          )}
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Recommendations */}
                {adventure.recommendations && (
                  <div className="mb-8">
                    <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                      Additional Recommendations
                    </h2>
                    <div className="bg-white rounded-xl p-6 border border-orange-200/50 space-y-6">
                      {adventure.recommendations.photo_opportunities && (
                        <div>
                          <h3 className="text-[#0c1c17] text-lg font-semibold mb-3 flex items-center gap-2">
                            📸 Photo Opportunities
                          </h3>
                          <ul className="text-[#0c1c17] text-sm space-y-2">
                            {adventure.recommendations.photo_opportunities.map(
                              (spot, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-orange-500 mt-1">
                                    •
                                  </span>
                                  <span>{spot}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {adventure.recommendations.local_tips && (
                        <div>
                          <h3 className="text-[#0c1c17] text-lg font-semibold mb-3 flex items-center gap-2">
                            💡 Local Tips
                          </h3>
                          <ul className="text-[#0c1c17] text-sm space-y-2">
                            {adventure.recommendations.local_tips.map(
                              (tip, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-orange-500 mt-1">
                                    •
                                  </span>
                                  <span>{tip}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {adventure.recommendations.hidden_gems && (
                        <div>
                          <h3 className="text-[#0c1c17] text-lg font-semibold mb-3 flex items-center gap-2">
                            💎 Hidden Gems
                          </h3>
                          <ul className="text-[#0c1c17] text-sm space-y-2">
                            {adventure.recommendations.hidden_gems.map(
                              (gem, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-orange-500 mt-1">
                                    •
                                  </span>
                                  <span>{gem}</span>
                                </li>
                              ),
                            )}
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
                    <div className="bg-white rounded-xl p-4 border border-orange-200/50">
                      <div className="mb-4">
                        <p className="text-[#0c1c17] text-base font-normal leading-normal">
                          {adventure.is_public
                            ? "Your adventure is public! Anyone with the link can view it."
                            : "Your adventure is private. Share it with others by making it public."}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* URL Input and Copy Button Row */}
                        {shareUrl && (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={`${window.location.origin}${shareUrl}`}
                              readOnly
                              className="flex-1 p-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-transparent"
                            />
                            <button
                              onClick={copyToClipboard}
                              className="px-4 py-2 bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white rounded-lg hover:from-[#E76F51] hover:to-[#D84B40] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                              {copied ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                              {copied ? "Copied!" : "Copy Link"}
                            </button>
                          </div>
                        )}

                        {/* Share/Make Private Button */}
                        <button
                          onClick={handleShare}
                          disabled={isSharing}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                            shareUrl ? "sm:w-auto" : "flex-1"
                          } ${
                            adventure.is_public
                              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl"
                              : "bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white hover:from-[#E76F51] hover:to-[#D84B40] shadow-lg hover:shadow-xl"
                          }
                            ${
                              isSharing ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                          {isSharing ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5 mr-1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"
                                ></path>
                              </svg>
                              {adventure.is_public
                                ? "Making Private..."
                                : "Making Public..."}
                            </>
                          ) : (
                            <>
                              <Share2 size={16} />
                              {adventure.is_public
                                ? "Make Private"
                                : "Share Adventure"}
                            </>
                          )}
                        </button>
                      </div>
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
