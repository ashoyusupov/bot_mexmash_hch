module.exports = (sequelize, DataTypes) => {
	const Husers = sequelize.define('Husers', {
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		username: DataTypes.STRING,
		name: DataTypes.STRING,
		phone_number: DataTypes.STRING,
		user_status: DataTypes.STRING,
		fio: DataTypes.STRING,
		city: DataTypes.STRING,
		language: DataTypes.STRING
	})

	return Husers
}
