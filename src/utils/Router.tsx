import CodeInput from '@pages/CodeInput';
import FormInputGroup from '@components/FormInputGroup';
import LoginForm from '@components/LoginForm';
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
		<Route
			path='/'
			element={<Default />}
			errorElement={<Navigate to={'/'} />}
		/>
		<Route path='/business' element={<Index />} />
		<Route path='/business/home' element={<Home />}>
			<Route element={<GetInfo />}>
				<Route index element={<FormInputGroup />} />
				<Route path='login' element={<LoginForm />} />
				<Route path='confirm-password' element={<ConfirmPassword />} />
			</Route>
		</Route>
		<Route path='/business/code-input' element={<CodeInput />} />
		<Route path='/business/finalize' element={<Finalize />} />
	</>,
);

const Router = createBrowserRouter(Routes);
export default Router;
