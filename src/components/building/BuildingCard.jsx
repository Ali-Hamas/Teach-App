import React from 'react';
import { Link } from 'react-router-dom';

const BuildingCard = ({ building }) => {
  return (
    <Link to={`/building/${building.id}`} className="block w-full">
      <div className="bg-[#0D1C22] p-4 rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-200">
        <h3 className="text-xl font-bold text-white mb-3">{building.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Technology</span>
          <span className="text-white font-semibold">{building.complexityPercentage}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Required</span>
          <div className="flex items-center">
            <span className="text-white font-semibold">{building.requiredTechnicians} Techs</span>
            <svg
              className="w-5 h-5 text-gray-400 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BuildingCard;