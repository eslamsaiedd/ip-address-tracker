import { useEffect } from "react";

type Location = {
  city: string;
  region: string;
  postalCode: string;
  timezone: string;
};

type InfoCardProps = {
  ip: string;
  isp: string;
  location: Location;
};

function InfoCard({ ip, isp, location }: InfoCardProps) {

    const [data, isData] = [ip, isp, location];
    useEffect(() => {
        if (!data) return;
    }, [data])
    
  return (
    <div className="card">
      <div className="item">
        <p className="label">IP ADDRESS</p>
        <h2 className="value">{isData? ip : "Loading..."}</h2>
      </div>

      <div className="divider" />

      <div className="item">
        <p className="label">LOCATION</p>
        <h2 className="value">
          {location.city}, {location.region} {location.postalCode}
        </h2>
      </div>

      <div className="divider" />

      <div className="item">
        <p className="label">TIMEZONE</p>
        <h2 className="value">UTC {location.timezone}</h2>
      </div>

      <div className="divider" />

      <div className="item">
        <p className="label">ISP</p>
        <h2 className="value">{isData? isp : "Loading..."}</h2>
      </div>
    </div>
  );
}

export default InfoCard;
