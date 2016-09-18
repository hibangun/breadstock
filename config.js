var path      = require('path')
var ROOT_PATH = path.normalize(__dirname + '/')

var config = {
	development: {
		root: ROOT_PATH,
    hideHeaderScript: true,
		header: {
			title: 'Breadstock',
			titleMeta: 'Breadstock',
      desc: 'The fattest bread, promise!',
		},
		db: {
	    db: 'breadstock-development',
	    host: 'ds033096.mlab.com',
	    port: 33096,  // optional, default: 27017
	    username: 'admin', // optional
	    password: 'admin', // optional
	    collection: 'user' // optional, default: sessions
	  },
	  secret: 'breadstockwassalestockbae',
		dbUrl: 'mongodb://admin:admin@ds033096.mlab.com:33096/breadstock-development',
    supportEmail: {
      email: 'mail.breadstock@gmail.com',
      password: 'breadstockawesome'
    },
    domain: 'http://127.0.0.1:3000/',
    twitterCountUrl: "http://urls.api.twitter.com/1/urls/count.json?url=",
    facebookCountUrl: "http://api.facebook.com/method/links.getStats?urls=",
    payment: [
      {
        order: 1,
        bank: 'BANK MANDIRI',
        code: '008',
        name: 'Hariawan Bangun Safutra',
        number: '137 0010 195341'
      }
    ],
    directPassword: 'direct',
    price: 10000,
    emailTest: true
	},
	production: {
		root: ROOT_PATH,
    hideHeaderScript: true,
    header: {
      title: 'Breadstock',
      titleMeta: 'Breadstock',
      desc: 'The fattest bread, promise!',
    },
    db: {
      db: 'breadstock-production',
      host: 'ds033116.mlab.com',
      port: 33116,  // optional, default: 27017
      username: 'admin', // optional
      password: 'admin', // optional
      collection: 'user' // optional, default: sessions
    },
    secret: 'breadstockwassalestockbae',
    dbUrl: 'mongodb://admin:admin@ds033116.mlab.com:33116/breadstock-production',
    supportEmail: {
      email: 'mail.breadstock@gmail.com',
      password: 'breadstockawesome'
    },
    domain: 'http://127.0.0.1:3000/',
    twitterCountUrl: "http://urls.api.twitter.com/1/urls/count.json?url=",
    facebookCountUrl: "http://api.facebook.com/method/links.getStats?urls=",
    payment: [
      {
        order: 1,
        bank: 'BANK MANDIRI',
        code: '008',
        name: 'Hariawan Bangun Safutra',
        number: '137 0010 195341'
      }
    ],
    directPassword: 'direct',
    price: 10000,
    emailTest: true
  }
}

module.exports = config[process.env.NODE_ENV || 'development']