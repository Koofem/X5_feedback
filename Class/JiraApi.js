const jiraClient = require('jira-client');
const {log} = require("nodemon/lib/utils");


class JiraApi {
	jira
	async init() {
		this.jira = new jiraClient({
			protocol: 'https',
			host: 'jira.x5food.tech',
			username: process.env.JIRA_LOGIN,
			password: process.env.JIRA_PASS,
			apiVersion: '2',
		});

		console.log('Джира подключена')
	}

	async createJiraTask(summary, description) {
		const data = {
			"fields": {
				"project":
					{
						"key": "RETRA"
					},
				"summary": `${summary}`,
				"description": `${description}`,
				"issuetype": {
					"name": "Task"
				}
			}
		}
		return this.jira.addNewIssue(data)
	}
}

const jiraApi = new JiraApi();
module.exports = jiraApi;
