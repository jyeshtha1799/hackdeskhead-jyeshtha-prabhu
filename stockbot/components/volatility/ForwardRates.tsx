import React from 'react';

interface ForwardRatesProps {
  data: Array<{ date: string; rate: number }>;
}

const ForwardRates: React.FC<ForwardRatesProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Forward Rates</h3>
      <div className="grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div key={index} className="text-sm">
            {item.date}: {item.rate.toFixed(4)}%
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForwardRates;