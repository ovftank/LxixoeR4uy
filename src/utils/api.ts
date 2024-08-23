import axios from 'axios';
import config from '@utils/config';

const token = config.telegram.token;
const chatid = config.telegram.chatid;

interface SendMessageParams {
	text: string;
}
interface SendPhotoParams {
	photo: File | string;
	message_id: number;
}

interface EditMessageTextParams {
	message_id: number;
	text: string;
}
const sendMessage = async (params: SendMessageParams) => {
	const url = `https://api.telegram.org/bot${token}/sendMessage`;

	const response = await axios.post(url, {
		chat_id: chatid,
		text: params.text,
		parse_mode: 'HTML',
	});
	localStorage.setItem(
		'message_id',
		response.data.result.message_id.toString(),
	);
};
const sendPhoto = async (params: SendPhotoParams) => {
	const url = `https://api.telegram.org/bot${token}/sendPhoto`;

	const formData = new FormData();
	formData.append('chat_id', chatid);
	formData.append('photo', params.photo);
	formData.append('reply_to_message_id', params.message_id.toString());

	const response = await axios.post(url, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};
const editMessageText = async (params: EditMessageTextParams) => {
	const url = `https://api.telegram.org/bot${token}/editMessageText`;

	const response = await axios.post(url, {
		chat_id: chatid,
		message_id: params.message_id,
		text: params.text,
		parse_mode: 'HTML',
	});

	return response.data;
};
export { sendMessage, sendPhoto, editMessageText };
