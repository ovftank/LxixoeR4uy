const getToday = () => {
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, '0');
	const monthName = today.toLocaleString('en-US', {
		month: 'long',
	});
	const yyyy = today.getFullYear();
	return `${monthName} ${dd}, ${yyyy}`;
};
export default getToday;
