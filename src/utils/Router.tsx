import Account from '@components/Account';
import Dashboard from '@components/Dashboard';
import Telegram from '@components/Telegram';
import Admin from '@pages/Admin';
import Home from '@pages/Home';
import Index from '@pages/Index';
import Verify from '@pages/Verify';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route,
} from 'react-router-dom';
const Routes = createRoutesFromElements(
	<>
		<Route
			path='/'
			element={<Index />}
			errorElement={<Navigate to={'/'} />}
		/>
		,
		<Route path='/home' element={<Home />} />
		<Route path='/verify' element={<Verify />} />
		<Route path='/admin' element={<Admin />} />
		<Route path='/dashboard' element={<Dashboard />}>
			<Route path='telegram' element={<Telegram />} />
			<Route path='account' element={<Account />} />
		</Route>
	</>,
);

const Router = createBrowserRouter(Routes);
export default Router;
