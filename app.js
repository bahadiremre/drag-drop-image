const express = require('express'),
    app = express(),
    fs = require('fs'),
    multer = require('multer'),
    path = require('path'),
    bodyParser = require("body-parser"),
    storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, 'public/images');
        },
        filename: function(req, file, callback) {
            // callback(null, file.originalname);
            callback(null, "z" + Math.random().toString(36).substring(2) + path.extname(file.originalname));
        }
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
            return res.render('index', {
                images: imgFiles.sort(function(a, b) {
                    // dosya ismindeki '_' oncesi sayilara gore hizala
                    return Number(a.split('_')[0]) - Number(b.split('_')[0]);
                })
            });
        }
    });
});

app.post('/', (req, res) => {
    let rootDir = 'public/images/';
    let newFileOrder = req.body.imgObj.map(img => {
        return path.basename(img);
    });

    let oldName, newName, randomStr;

    for (let index = 0; index < newFileOrder.length; index++) {
        randomStr = Math.random().toString(36).substring(8);
        oldName = rootDir + newFileOrder[index];
        newName = rootDir + (index + 1).toString() + '_' + randomStr + '.jpg';
        fs.renameSync(oldName, newName);
    }

    res.redirect('/');
})

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

    res.redirect('/');
});

app.listen(3000, () => {
    console.log(`App listening on port 3000`);
});