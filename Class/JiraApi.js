const jiraClient = require('jira-client');
const {log} = require("nodemon/lib/utils");


class JiraApi {
	jira
	async init() {
		this.jira = new jiraClient({
			protocol: 'https',
			host: 'x5feedback.atlassian.net',
			username: 'mymelmike@yandex.ru',
			password: '4Rc97iAdXQHaH0LXX68BDCAF',
			apiVersion: '2',
		});

		console.log('Заебись, джира подключена')
	}

	async createJiraTask(summary, description) {
		const data = {
			"fields": {
				"project":
					{
						"key": "FEED"
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
