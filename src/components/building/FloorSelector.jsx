import React from 'react';

const FloorSelector = ({ floors, onSelectFloor, selectedFloor }) => {
  return (
    <div className="relative">
      <select
        value={selectedFloor || ''}
        onChange={(e) => onSelectFloor(parseInt(e.target.value, 10))}
        className="w-full appearance-none bg-[#0D1C22] border-2 border-gray-700 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-teal-500"
      >
        <option value="">Select Your Current Floor</option>
        {floors.map(floor => (
          <option key={floor.id} value={floor.number}>
            Floor {floor.number} {floor.desc ? `(${floor.desc})` : ''}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
};

export default FloorSelector;