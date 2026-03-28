import MapView from "../components/MapView";
import { useEffect, useState } from "react";
import { getIpData } from "../service/ipApi";
import SearchBar from "../components/SearchBar";
import "../components/global.css";
import { InfoCards } from "../components/Infocards";
import { MapPin, ShieldOff, X } from "lucide-react";

interface IpData {
  ip: string;
  isp: string;
  location: {
    city: string;
    region: string;
    postalCode: string;
    timezone: string;
    lat: number;
    lng: number;
    country: string;
    countryCode: string;
  };
}

type GeoStatus = "idle" | "asking" | "granted" | "denied";

function Tracker() {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [showBanner, setShowBanner] = useState(true);

  const fetchIp = async (ip: string = "") => {
    setLoading(true);
    setError(false);
    setData(null);
    try {
      const result = await getIpData(ip);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      setShowBanner(false);
      fetchIp("");
      return;
    }

    setGeoStatus("asking");
    navigator.geolocation.getCurrentPosition(
      () => {
        setGeoStatus("granted");
        setShowBanner(false);
        fetchIp("");
      },
      () => {
        setGeoStatus("denied");
        fetchIp("");
      },
      { timeout: 8000 }
    );
  }, []);

  const handleSearch = (ip: string) => fetchIp(ip);
  const handleRetry = () => fetchIp("");

  return (
    <main className="w-full bg-[#F7F9FB] dark:bg-[var(--second-primary-color)] min-h-[calc(100vh-64px)]">

      {/* Geolocation asking banner */}
      {geoStatus === "asking" && showBanner && (
        <div role="status" aria-live="polite"
          className="w-full bg-[var(--primary-color)] text-white px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            Requesting location access to show your current IP data…
          </div>
          <button onClick={() => setShowBanner(false)} aria-label="Dismiss"
            className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Geo denied notice */}
      {geoStatus === "denied" && showBanner && (
        <div role="note"
          className="w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] font-medium">
            <ShieldOff className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            Location access denied — showing data based on your IP address instead.
          </div>
          <button onClick={() => setShowBanner(false)} aria-label="Dismiss"
            className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <SearchBar onSearch={handleSearch} />

      {/* Info cards */}
      <section aria-label="IP lookup results" aria-live="polite" aria-busy={loading}
        className="pb-6 max-w-7xl m-auto px-3 sm:px-5 lg:px-7 flex justify-center">

        {/* Loading */}
        {(loading || geoStatus === "asking") && (
          <div className="flex justify-center items-center w-full max-w-[800px] h-[120px]"
            role="status" aria-label="Loading IP data">
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:0ms]" />
              <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:150ms]" />
              <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:300ms]" />
              <span className="ml-2 dark:text-white text-[var(--black-color)] text-sm font-semibold">
                {geoStatus === "asking" ? "Waiting for location permission…" : "Locating IP…"}
              </span>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && geoStatus !== "asking" && error && (
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[800px]">
            <InfoCards className="flex-1" show={true} fontTitle="text-[32px] sm:text-[40px]"
              title="System Alert" info="Invalid IP or Domain"
              lastInfo="The string provided does not match any known global routing protocol. Please verify the IPv4/IPv6 address or ensure the top-level domain is correctly formatted."
              quickTips={false} showCopyButton={false} showIconLocation={false} showRouter={false} onRetry={handleRetry} />
            <div className="flex sm:flex-col flex-row gap-3 sm:w-[220px]">
              <InfoCards quickTips={true} className="flex-1 sm:flex-none border-l-4 border-red-500"
                show={false} showCopyButton={false} showIconLocation={false} showRouter={false} onRetry={handleRetry} />
              <InfoCards className="flex-1 sm:flex-none border-l-4 border-[#2E5BFF]"
                title="Try Again" info="New search" lastInfo="Enter a valid IPv4, IPv6, or domain"
                show={false} quickTips={false} showCopyButton={false} showIconLocation={false} showRouter={false} onRetry={handleRetry} />
            </div>
          </div>
        )}

        {/* Success state */}
        {!loading && geoStatus !== "asking" && !error && data && (
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[800px]">
            <InfoCards className="flex-1" showCopyButton={true} fontTitle="text-[32px] sm:text-[42px]"
              title="Current IP" info={data.ip} lastInfo=""
              show={false} quickTips={false} showIconLocation={false} showRouter={false} onRetry={handleRetry} />
            <div className="flex sm:flex-col flex-row gap-3 sm:w-[220px]">
              <InfoCards className="flex-1 sm:flex-none border-l-4 border-[#2E5BFF]" showRouter={true}
                title="Location" info={`${data.location.city}, ${data.location.region}`}
                lastInfo={data.location.country}
                show={false} quickTips={false} showCopyButton={false} showIconLocation={false} onRetry={handleRetry} />
              <InfoCards className="flex-1 sm:flex-none border-l-4 border-[#2E5BFF]" showIconLocation={true}
                title="ISP Provider" info={data.isp} lastInfo={`TZ: ${data.location.timezone}`}
                show={false} quickTips={false} showCopyButton={false} showRouter={false} onRetry={handleRetry} />
            </div>
          </div>
        )}
      </section>

      {/* Map */}
      {!loading && geoStatus !== "asking" && !error && data && (
        <section aria-label="Location map"
          className="pb-8 max-w-7xl m-auto px-3 sm:px-5 lg:px-7 flex justify-center">
          <div className="w-full max-w-[800px]">
            <MapView location={data.location} />
          </div>
        </section>
      )}
    </main>
  );
}

export default Tracker;
