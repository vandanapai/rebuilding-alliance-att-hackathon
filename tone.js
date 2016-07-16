var watson = require('watson-developer-cloud');
var creds = require('./bluemix-creds');

var tone_analyzer = watson.tone_analyzer({
    username: creds.tone.username,
    password: creds.tone.password,
    version: 'v3',
    version_date: '2016-05-19'
});

module.exports = function(text)
{
    tone_analyzer.tone({ text: text },
        function(err, tone) {
            if (err)
                console.log(err);
            else
                console.log(JSON.stringify(tone, null, 2));
    });
};
