export const config = {
	server: {
		port: 3001,
	},
	mongoUri: 'mongodb://localhost:27017/food_ordering',
	jwt: {
		secret: 'jciucaiadhjhowviuadf',
		expiresIn: '1d',
	},
	smtp: {
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		user: '', 
		pass: '', 
		from: 'KORE Food Ordering System <@gmail.com>', 
		allowSelfSigned: true, 
		ignoreTLS: false, 
		devMode: true, 
	},
} as const;

export type AppConfig = typeof config;
export default config;
