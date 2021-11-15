const { mongodb } = require('Models/MongoBD');
class UserBD {
	userBD
	constructor() {
	}

	async init() {
		this.userBD = mongodb.db.collection('users');
	}

	async findUser(user) {
		return await this.userBD.findOne({id: user.id});
	}

	async saveOrUpdateUser(user) {
			return await this.userBD.findOneAndUpdate({id: user.id}, {
				$set: {
					first_name: user.first_name,
					username: user.username,
					last_name: user.last_name? user.last_name : '',
					id: user.id,
				},
			}, {upsert: true});
		}

		async setActionToUser(user, action) {
			return await this.userBD.findOneAndUpdate({id: user.id}, {
				$set: {
					current_action: action,
				},
			}, {upsert: true});
		}

		async setFullInfoAboutUser(user, action) {
			return await this.userBD.findOneAndUpdate({id: user.id}, {
				$set: {
					full_info: action,
				},
			}, {upsert: true});
		}

		async resetUserAction(user) {
			return await this.userBD.updateOne({id: user.id}, {
				$unset: {
					current_action: 1
				}
			})
		}

		async deleteFullInfoAboutUser(user) {
			return await this.userBD.updateOne({id: user.id}, {
				$unset: {
					full_info: 1
				}
			})
		}

		async getFullInfoAboutUser(user) {
			const userBD = await this.findUser(user)

			return userBD.full_info
		}
}

const userBD = new UserBD();
module.exports = userBD;
