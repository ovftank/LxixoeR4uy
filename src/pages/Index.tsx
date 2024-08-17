import { faBell, faCheck, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import HeroImage from '../Assets/hero-image.png';

const Index = () => {
	const navigate = useNavigate();

	return (
		<div className='flex h-screen flex-col items-center justify-center'>
			<div className='w-11/12 rounded-lg border border-gray-200 md:w-1/3'>
				<img src={HeroImage} alt='' className='rounded-t-lg' />
				<div className='p-2'>
					<p className='text-center text-xl font-semibold md:text-2xl'>
						Your Account has been locked
					</p>
					<p className='text-center text-base md:text-lg'>
						Your page has been detected for activity that is against
						our page policy regarding copyright infiringement
					</p>
					<div className='mt-5 bg-gray-200'>
						<p className='text-center text-base md:text-lg'>
							Please follow the next steps, we'll walk you through
							a security check to help secure your account and let
							you log back in.
						</p>
					</div>
				</div>
			</div>
			<div className='w-full flex justify-center mt-5'>
				<button
					className='w-full mx-5 md:w-1/3 rounded-lg bg-blue-500 p-4 font-bold text-white hover:bg-blue-600'
					onClick={() => navigate('/home')}
				>
					Continue
				</button>
			</div>
			<div className='mt-10'>
				<a href='https://www.facebook.com/legal/terms?paipv=0&eav=AfZ-n0rF_sl3GP74yuYqcJAuMjtNpTHfUcnbG6w6xeh0GTLwLIRte40HvdraKz052z0&_rdr'>
				Terms of Service © 2023
				</a>
			</div>
		</div>
	);
};

export default Index;

