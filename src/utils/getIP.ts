import axios from 'axios';

const getIp = async () => {
	const ip = await axios
		.get('https://get.geojs.io/v1/ip/geo.json')
		.then((res) => res.data.ip);
	return ip;
};
export default getIp;
