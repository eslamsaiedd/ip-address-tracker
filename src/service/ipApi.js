export const getIpData = async (ip) => {
  try {
    // Use ip-api.com (free, no API key needed)
    const url = ip ? `http://ip-api.com/json/${ip}` : "http://ip-api.com/json/";

    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();

    // Check for API errors
    if (data.status === "fail") {
      throw new Error(data.message || "API Error");
    }

    // Map ip-api.com response to expected format
    return {
      ip: data.query,
      isp: data.isp || data.org || "Unknown",
      location: {
        city: data.city || "Unknown",
        region: data.regionName || data.region || "Unknown",
        postalCode: data.zip || "Unknown",
        timezone: data.timezone || "Unknown",
        lat: parseFloat(data.lat) || 0,
        lng: parseFloat(data.lon) || 0,
        country: data.countryCode || data.country || "Unknown",
      },
    };
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};
