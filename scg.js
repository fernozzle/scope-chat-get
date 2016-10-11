var form = d3.select('form');
form.on('submit', function() {
	d3.event.preventDefault();
	console.log(form.select('#id').property('value'))
});

var id = '1PlKQeOojpaKE';
var token = '2CWFwOM8Pw00EpUg2FYhK54S7jQHrXmE9pyuOknNhQNKp_zDxyRfzQ-SfnewuBhAu3xnYoJQi3Tw_Eb6u84Ls4ogxJYxyeMgrxABDHwERBfAWbNAn855Pn1F5Ikrwt3zCAzS7zk4kDCUF4cyiIgSaON3LIYpJ9t2HTKxQdiWPjmf7xtwbYJvvTOqaW62YBavXR8sMPJKfiLKk6Vzl8_A';

var url = 'https://prod-chatman-ancillary-us-east-1.periscope.tv/k=' + id + '/chatapi/v1/history';
var payload = {
	'access_token': token,
	'cursor': '',
	'limit': 1000,
	'since': 0,
	'url': url
};

var req = new XMLHttpRequest();
req.open('post', url);
req.setRequestHeader('Content-Type','application/json');
req.onload = function() {
	var response = JSON.parse(req.responseText);
	console.table(response['messages'].map(function(mess) {
		mess.payload = JSON.parse(mess.payload);
		mess.payload.body = JSON.parse(mess.payload.body);
		return mess.payload.body;
	}));
};
req.send(JSON.stringify(payload));
