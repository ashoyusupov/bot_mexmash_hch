module.exports = (sequelize, DataTypes) => {
	const Hcheck = sequelize.define('Hcheck', {
		hc_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		tgid: DataTypes.STRING,
		surveyid: DataTypes.STRING,
		hstatus: DataTypes.STRING,
		comments: DataTypes.STRING
	})

	return Hcheck
}
