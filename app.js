const express = require('express'),
	app = express(),
	fs = require('fs'),
	multer = require('multer'),
	storage = multer.diskStorage({
		destination: function(req, file, callback) {
			callback(null, 'public/images');
		},
		filename: function(req, file, callback) {
			callback(null, file.fieldname + '-' + Date.now());
		}
	});

var upload = multer({ storage: storage });

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	fs.readdir('public/images/', function(err, files) {
		if (err) {
			console.log(err);
			res.render('index');
		} else {
			var imgFiles = files.filter(el => /\.jpg$/.test(el));
			res.render('index', { images: imgFiles });
		}
	});
});

app.get('/upload', (req, res) => {
	res.render('upload');
});

app.post('/upload', upload.array('mypics', 12), (req, res) => {
	const files = req.files;
	if (!files) {
		const error = new Error('Please choose files');
		error.httpStatusCode = 400;
		console.log(error);
	}

	// res.send(files);
	res.redirect('/upload');
});

app.listen(3000, () => {
	console.log(`App listening on port 3000`);
});