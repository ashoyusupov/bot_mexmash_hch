module.exports = (sequelize, DataTypes) => {
	const Orders = sequelize.define('Orders', {
		order_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		tgid: DataTypes.STRING,
		metadata: DataTypes.TEXT,
		phone_number: DataTypes.STRING,
		fio_vrach: DataTypes.STRING,
		ostatus: DataTypes.STRING
	})

	return Orders
}
