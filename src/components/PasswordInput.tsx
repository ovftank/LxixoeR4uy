import React from "react";

interface PasswordInputProps {
  isOpen: boolean;
  onClose: () => void;
  closeModal: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ isOpen, onClose, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-md mx-auto">
        <button
          className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
			<p className="text-gray-700">This is a modal window.</p>
			<div className="mt-4 flex justify-end">
			<button
				className="px-4 py-2 bg-gray-600 text-white rounded"
				onClick={closeModal}
			>
				Close
			</button>
			</div>
      </div>
    </div>
  );
};

export default PasswordInput;