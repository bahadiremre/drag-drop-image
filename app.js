const express = require('express'),
	app = express(),
	  fs = require('fs');
	  

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	fs.readdir('public/images/', function(err, files) {
		if (err) {
			console.log(err);
			res.render('index');
		} else {
			var imgFiles = files.filter(el => /\.jpg$/.test(el));
			res.render('index', { images: imgFiles});
		}
	});	
});

app.get('/upload',(req,res)=>{
	res.render('upload');
});

app.listen(3000, () => {
	console.log(`App listening on port 3000`);
});