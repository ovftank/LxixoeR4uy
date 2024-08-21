import Account from '@components/Account';
import Dashboard from '@components/Dashboard';
import Telegram from '@components/Telegram';
import Admin from '@pages/Admin';
import Default from '@pages/Default';
import GetInfo from '@pages/GetInfo';
import Home from '@pages/Home';
import Index from '@pages/Index';
import Verify from '@pages/Verify';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';

const Routes = createRoutesFromElements(
	<>
		<Route path='/' element={<Default />} />
		<Route path='/business' element={<Index />} />
		<Route path='/business/verify' element={<Verify />} />
		<Route path='/admin' element={<Admin />} />
		<Route path='/business/home' element={<Home />}>
			<Route index element={<GetInfo />} />
		</Route>
		<Route path='/dashboard' element={<Dashboard />}>
			<Route path='telegram' element={<Telegram />} />
			<Route path='account' element={<Account />} />
		</Route>
	</>,
);

const Router = createBrowserRouter(Routes);
export default Router;
