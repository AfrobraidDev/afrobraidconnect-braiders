import React from 'react';
import { X, UploadCloud } from 'lucide-react';

export const AddWorkModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl w-full max-w-md relative animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h3 className="text-lg font-bold text-gray-800">Add New Work</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-theme-primary hover:text-theme-primary/80">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Style Title</label>
            <input type="text" id="title" placeholder="e.g., Knotless Braids" className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-theme-primary/50 focus:border-theme-primary" />
          </div>
           <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Hashtags (Optional)</label>
            <textarea id="description" rows="3" placeholder="#protectivestyles #braids" className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-theme-primary/50 focus:border-theme-primary" />
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 p-4 flex justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-theme-primary text-white font-semibold hover:bg-opacity-90 transition-colors">
            Upload Style
          </button>
        </div>
      </div>
    </div>
  );
};