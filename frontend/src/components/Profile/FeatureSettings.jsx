import React from 'react';
import { useFeatures } from '../../context/FeatureContext';

export const FeatureSettings = () => {
  const { aiEnabled, toggleAI } = useFeatures();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Features</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700">Enable AI Assistant</p>
            <p className="text-sm text-gray-500">Includes productivity tips and the AI chat widget.</p>
          </div>
          <button
            onClick={toggleAI}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};