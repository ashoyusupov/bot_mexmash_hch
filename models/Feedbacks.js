module.exports = (sequelize, DataTypes) => {
	const Feedbacks = sequelize.define('Feedbacks', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		tgid: DataTypes.STRING,
		metadata: DataTypes.TEXT
	})

	return Feedbacks
}
