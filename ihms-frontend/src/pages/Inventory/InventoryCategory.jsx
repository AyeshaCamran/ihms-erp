import React from "react";
import { useNavigate } from "react-router-dom";

// Real 70 category list
const categories = [
  'ASSETS', 'ASSETS-MED', 'BIOHAZARD', 'BME', 'BMI', 'CHEMICAL', 'CLEAN-HK',
  'CONTROL', 'ECG-PAPER', 'ECS-CTG', 'ELECTRICAL', 'EQUIPMENT', 'FIRE CSSD',
  'FIRE EXTG', 'FIRE REFIL', 'FIRE SPRS', 'GAMES', 'GAS PLANT', 'HAZARDOUS',
  'HOMOEO-MED', 'HOMOEO-SPR', 'INJECTION', 'INSTRUMENT', 'IT CELL', 'LAB ITEM',
  'LAB ITEMS', 'LAB MODEL', 'LAB-MODEL', 'LINEN', 'LINEN-OTH', 'MAINTAINCE',
  'MASK', 'MEDICINE', 'OPTHAL-EDR', 'OPTHAL-EQP', 'OPTHAL-INJ', 'OPTHAL-LAB',
  'OPTHAL-LEN', 'OPTHAL-SPR', 'OPTHAL-SUR', 'OPTHAL-TST', 'OTHER', 'OTHERS',
  'PHARMACY', 'POLY BAGS', 'PROT-ITEM', 'REAGENT', 'REAGENTS', 'STAT-DIETC',
  'STAT-PO', 'STAT-PRINT', 'STAT-PURC', 'SURGICAL', 'TEST KIT', 'WASAZRA',
  'X-RAY DENT', 'X-RAY FILM', 'X-RAY-ASST', 'X-RAY-EQP', 'X-RAY-EQPD',
  'X-RAY-LEAD', 'X-RAY-RGT', 'X-RAY-SPR', 'X-RAY-USG', 'X-RAYCTFIL',
  'X-RAYCTINJ', 'X-RAYCTPAP', 'X-RAYGAS', 'X-RAYINJCT', 'X-RAYMRINJ'
];

const InventoryCategory = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/inventory/category/${encodeURIComponent(category)}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Inventory Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(category)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 font-medium shadow-md hover:bg-blue-100 hover:text-blue-700 transition duration-200"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InventoryCategory;
