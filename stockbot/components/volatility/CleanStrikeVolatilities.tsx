import React from 'react';

interface CleanStrikeVolatilitiesProps {
  data: Array<{ strike: number; volatility: number }>;
}

const CleanStrikeVolatilities: React.FC<CleanStrikeVolatilitiesProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Clean Strike Volatilities</h3>
      <div className="grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div key={index} className="text-sm">
            {item.strike}: {item.volatility.toFixed(2)}%
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleanStrikeVolatilities;