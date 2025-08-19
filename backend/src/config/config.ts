export const config = {
	server: {
		port: 3001,
	},
	mongoUri: 'mongodb://localhost:27017/food_ordering',
	jwt: {
		secret: 'f3a1b2c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
		expiresIn: '1d',
	},
	smtp: {
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		user: 'noreply.koreconfirmations@gmail.com', 
		pass: 'jciucaiadhjhowvi', 
		from: 'KORE Food Ordering System <noreply.koreconfirmations@gmail.com>', 
		allowSelfSigned: true, 
		ignoreTLS: false, 
		devMode: true, 
	},
} as const;

export type AppConfig = typeof config;
export default config;
