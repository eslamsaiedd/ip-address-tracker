import InfoCard from "../components/InfoCard";
import SearchBar from "../components/SearchBar";
import MapView from "../components/MapView";
import { useEffect, useState } from "react";
import { getIpData } from './../service/ipApi';

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
  };
}

function Home() {

    const [data, setData] = useState<IpData | null>(null);
    
    useEffect(() => {
        getIpData('').then((result) => {
            setData(result);
        }).catch(console.error)
    }, [])

    const handleSearch = async (ip: string) => {
        try {
        const result = await getIpData(ip);
        setData(result);
        } catch (err) {
        console.error(err);
        }
    };


  return (
    <div>
        {/* Header */}
        <div>
            <SearchBar onSearch={handleSearch} />
        </div>

        {/* Info Card (absolute) */}
        {data && (
            <InfoCard
            ip={data.ip}
            isp={data.isp}
            location={data.location}
            />
        )}

        {/* Map */}
        <MapView location={data?.location} />
    </div>
  );
}

export default Home;