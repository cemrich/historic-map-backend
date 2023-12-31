module.exports =  ({ env }) => ({
	connection: {
		client: 'mysql',
		connection: {
		host: env('DATABASE_HOST', 'localhost'),
			port: env.int('DATABASE_PORT', 3306),
			database: env('DATABASE_NAME', 'historic-map'),
			user: env('DATABASE_USERNAME', 'strapi'),
			password: env('DATABASE_PASSWORD'),
			ssl: env.bool('DATABASE_SSL', false)
		}
	}
});
