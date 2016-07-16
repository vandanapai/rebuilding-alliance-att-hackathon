var watson = require('watson-developer-cloud');
var creds = require('./bluemix-creds');

var language_translator = watson.language_translator({
  username: creds.translator.username,
  password: creds.translator.password,
  version: 'v2'
});

module.exports = function(text, lang, cb)
{
    language_translator.translate({
        text: text,
        source : 'en',
        target: lang
    }, cb);
}
