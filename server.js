const express = require('express');
var formidable = require('formidable');
const fs = require('fs');

//for Heroku                  //for local
const port = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname + '/'));



app.get('/', (req, res) => {
    // res.send('<h1>hello Express!</h1>');
    res.render('index.html');
});

app.post('/fileupload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '\\' + 'temp';
    console.log('In fileupload');
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = __dirname + '\\inputfaces\\' + files.filetoupload.name;
        //console.log(files.filetoupload.name);
        var lstExits = [];
        fs.readdir(__dirname + '\\inputfaces\\', (err, files) => {
            console.log(files.length);
            if (files.length > 0) {
                files.forEach((ele) => {
                    console.log('deleting');
console.log(ele);
                    fs.unlink( __dirname + '\\inputfaces\\' + ele, (err) => {
                        console.log('fail to remove');
                    });

                });
            }
        });

        console.log('my path: ', newpath);
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                throw err;
            }
            res.write('File uploaded and moved!');
            res.end();
        });
    });
});


var fetchNotes = () => {
    try {
        var notesString = fs.readFileSync('notes-data.json');
        return JSON.parse(notesString);
    } catch (e) {
        return [];
    }
};
//change port for Heroku
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});