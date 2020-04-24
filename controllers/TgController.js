const { Users, Orders, Feedbacks, Hcheck } = require('../models')
const db = require('../models')

db.sequelize.getQueryInterface().showAllSchemas().then((tableObj) => {
	console.log('// Tables in database', '==========================')
	console.log(tableObj)
})

module.exports = {
	timeSince (date) {

		var seconds = Math.floor((new Date() - date) / 1000)

		var interval = Math.floor(seconds / 31536000)

		if (interval > 1) {
			return interval + ' years'
		}
		interval = Math.floor(seconds / 2592000)
		if (interval > 1) {
			return interval + ' months'
		}
		interval = Math.floor(seconds / 86400)
		if (interval > 1) {
			return interval + ' days'
		}
		interval = Math.floor(seconds / 3600)
		if (interval > 1) {
			return interval + ' hours'
		}
		interval = Math.floor(seconds / 60)
		if (interval > 1) {
			return interval + ' minutes'
		}
		return Math.floor(seconds) + ' seconds'
	},
	async updateUser (tgid, column, input) {
		try {
			let data = {}
			data[column] = input
			const result = await Users.update(
				data,
				{ where: { user_id: tgid } }
			)
			console.log('update', result)
			return result
		} catch (error) {
			console.log(error)
		}
	},
	async updateTgByUsername (tgid, msg) {
		try {
			let data = {}
			data['user_id'] = tgid
			data['user_status'] = 'REGISTERED'
			data['phone_number'] = msg.contact.phone_number
			data['fio'] = msg.chat.first_name
			const result = await Users.update(
				data,
				{ 
					where: { username: msg.chat.username }
				}
			)
			return result
		} catch (error) {
			console.log(error)
		}
	},
	async updateTgId (tgid, phone) {
		try {
			phone = phone.replace(/[^\d]/g, '')

			let data = {}
			data['user_id'] = tgid
			data['user_status'] = 'REGISTERED'
			const result = await Users.update(
				data,
				{ 
					where: { phone_number: phone }
				}
			)
			return result
		} catch (error) {
			console.log(error)
		}
	},
	async getHstatus (param) {
		try {
			const users = await db.sequelize.query('SELECT * FROM hstatus where city=(:cparam)', {
				replacements: {cparam: param},
				type: db.sequelize.QueryTypes.SELECT
			})
			console.log(users)
			let text = '👨‍⚕️ Ходимларнинг соглиги холати:\n'
			for (let i = 0; i < users.length; i++) {
				let row = users[i]
				let userStatus = (row.hstatus=='good'?'✅ <b>good</b>':(row.hstatus=='bad'?'❌ bad':'ro\'yxatdan o\'tmagan'))
				let userFio = ((row.fio==null||row.fio=='')?(row.username==''||row.username==null?row.phone_number:row.username):row.fio)

				text += '<a href="tg://user?id='+row.user_id+'">'+userFio+'</a>' + ': ' + userStatus + ' ' + (row.hstatus=='no'?'':this.timeSince(row.updatedAt)+' ago')+'\n'
			}

			return text
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch '+error
			)
		}
	},
	async getUsers (param) {
		try {
			const users = await Users.findAll({
				raw: true,
				where: {
					user_status: 'REGISTERED',
					city: param
				},
				order: [
					['user_id', 'DESC']
				]
			})
			return users
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch '+error
			)
		}
	},
	async getUnregs () {
		try {
			const users = await Users.findAll({
				raw: true,
				where: {
					user_status: null
				}
			})
			let text = 'Список кто не регистрировался:\n'
			for (let i = 0; i < users.length; i++) {
				let row = users[i]
				text += row.fio+'\n'
			}

			return text
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch '+error
			)
		}
	},
	async checkUser (tgid) {
		try {
			const users = await Users.findAll({
				raw: true,
				limit: 1,
				where: {
					user_id: tgid,
					user_status: 'REGISTERED'
				},
			})
			return users
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch '+error
			)
		}
	},
	async onerecord () {
		try {
			const users = await Users.findAll({
				raw: true,
				limit: 10
			})
			return users
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch the zakazs'
			)
		}
	},
	async newFeedback (tgid, meta) {
		try {			
			const fback = await Feedbacks.create({
				tgid: tgid,
				metadata: meta
			})
			return fback
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch the zakazs'
			)
		}
	},
	async newHstatus (tgid, timestamp, hstatus, comments ) {
		try {			
			const hsts = await Hcheck.create({
				tgid: tgid,
				surveyid: timestamp,
				hstatus: hstatus,
				comments: comments
			})
			return hsts
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch the zakazs'
			)
		}
	},
	async updateHstatus (tgid, timestamp, column, input) {
		try {
			let data = {}
			data[column] = input
			const result = await Hcheck.update(
				data,
				{
					where: { 
						tgid: tgid,
						surveyid: timestamp
					} 
				}
			)
			console.log('update', result)
			return result
		} catch (error) {
			console.log(error)
		}
	},
	async newOrder (tgid, meta) {
		try {
			const res = await Users.findAll({
				raw: true,
				limit: 1,
				where: {
					user_id: tgid
				},
			}).then( async (users) => {
				console.log('users1', users)
				const user = users[0]
				const metajson = JSON.stringify(meta)
				const result = await Orders.create({
					tgid: tgid,
					metadata: metajson,
					phone_number: user.phone_number,
					fio_vrach: user.fio,
					ostatus: 'NOT CONFIRMED'
				})
				return result
			})
			return res
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch the zakazs'
			)
		}
	},
	async newUser (tgid, msg) {
		try {
			const created = await Users.findOrCreate({
				where: {//object containing fields to found
					user_id: tgid
				},
				defaults: {//object containing fields and values to apply
					tgid: tgid,
					username: msg.from.username,
					name: msg.from.first_name
				}
			})
			return created
			// const user = await Users.create({
			// 	tgid: tgid,
			// 	username: msg.from.username,
			// 	name: msg.from.first_name,
			// 	phone_number: msg.contact.phone_number
			// })
			// return user.id
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch '+error
			)
		}
	}
}
