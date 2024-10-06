import React from 'react';

interface EventVolatilitiesProps {
  data: Array<{ date: string; volatility: number }>;
}

const EventVolatilities: React.FC<EventVolatilitiesProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Event Volatilities</h3>
      <div className="grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div key={index} className="text-sm">
            {item.date}: {item.volatility.toFixed(2)}%
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventVolatilities;