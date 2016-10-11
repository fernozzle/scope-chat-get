const messTypes = {
	1: 'text',
	2: 'like',
	3: 'join',
	4: 'geo',
};
const form = d3.select('form');
form.on('submit', function() {
	d3.event.preventDefault();
	console.log(form.select('#id').property('value'))
});

const id = '1PlKQeOojpaKE';
const token = '2CWFwOM8Pw00EpUg2FYhK54S7jQHrXmE9pyuOknNhQNKp_zDxyRfzQ-SfnewuBhAu3xnYoJQi3Tw_Eb6u84Ls4ogxJYxyeMgrxABDHwERBfAWbNAn855Pn1F5Ikrwt3zCAzS7zk4kDCUF4cyiIgSaON3LIYpJ9t2HTKxQdiWPjmf7xtwbYJvvTOqaW62YBavXR8sMPJKfiLKk6Vzl8_A';

get(id, token, 3);
function get(id, token, timesLeft, messages = [], users = {}, cursor = '') {
	if (timesLeft < 0) {
		console.table(users);
		console.log('Done!');
		return;
	}

	const url = 'https://prod-chatman-ancillary-us-east-1.periscope.tv/k=' + id + '/chatapi/v1/history';
	const payload = {
		'access_token': token,
		'cursor': cursor,
		'limit': 1000,
		'since': 0,
		'url': url
	};

	const req = new XMLHttpRequest();
	req.open('post', url);
	req.setRequestHeader('Content-Type','application/json');
	req.onload = () => {
		const response = JSON.parse(req.responseText);
		const newMessages = response['messages'].map(mess => {
			const payload = JSON.parse(mess.payload);
			const body    = JSON.parse(payload.body);
			const sender = payload.sender;

			const user = users[sender.user_id] || {};
			user['username'] = body.username || sender.username || user['username'];
			user['name'] = body.displayName || sender.display_name || user['name'];
			user['icon'] = body.profileImageURL || sender.profile_image_url || user['icon'];
			users[sender.user_id] = user;

			return {
				time: payload.timestamp,
				type: messTypes[body.type] || body.type,
				id: body.uuid,
				heading: body.heading,
				lat: body.lat,
				lng: body.lng,
				body: body.body,
				uid: sender.user_id,
			};
		});
		console.table(newMessages);

		const cursor = newMessages[newMessages.length - 1].time + '';
		messages.push(...newMessages);
		get(id, token, timesLeft - 1, messages, users, cursor);
	};
	req.send(JSON.stringify(payload));
}
/* MESSAGE TYPES
 * 1: Text
 * 2: Heart
 * 3: Joined
 * 4: Geolocation
 */
