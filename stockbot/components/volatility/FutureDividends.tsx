import React from 'react';

interface FutureDividendsProps {
  data: Array<{ date: string; dividend: number }>;
}

const FutureDividends: React.FC<FutureDividendsProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Future Dividends</h3>
      <div className="grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div key={index} className="text-sm">
            {item.date}: ${item.dividend.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FutureDividends;