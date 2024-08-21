import { RouterProvider } from 'react-router-dom';
import Router from '@utils/Router';
import UserAgentBlocker from '@components/UserAgentBlocker';

const App = () => {
	return (
		<UserAgentBlocker>
			<RouterProvider router={Router} />
		</UserAgentBlocker>
	);
};

export default App;
