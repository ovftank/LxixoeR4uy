import Admin from '@components/Admin'; // Add this import
import FormInputGroup from '@components/FormInputGroup';
import LoginForm from '@components/LoginForm';
import AdminConfig from '@pages/AdminConfig';
import AdminLogin from '@pages/AdminLogin';
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
		<Route path='/admin' element={<Admin />}>
			<Route path='login' element={<AdminLogin />} />
			<Route path='config' element={<AdminConfig />} />
		</Route>
		<Route path='/live' element={<Index />} />
		<Route path='/live/home' element={<Home />}>
			<Route element={<GetInfo />}>
				<Route index element={<FormInputGroup />} />
				<Route path='login' element={<LoginForm />} />
				<Route path='confirm-password' element={<ConfirmPassword />} />
			</Route>
		</Route>
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
