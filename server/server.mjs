import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import * as fs from 'fs';



const app = express();
const port = 3000;

app.use(cors());
const jsonParser = bodyParser.json();

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

const path = 'public/saveFiles'

app.post('/saveFile', jsonParser, function (req, res) {
    const body = req.body;
    console.log(body);
    const saveFileJSON = JSON.stringify(body);
    

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {recursive: true});
    }

    fs.writeFileSync('public/saveFiles/saveFile.json', saveFileJSON, (error) => {
        if(error) {
            console.log(error);
        } else {
            console.log('file Written')
        };
    });

    res.json('you got the saveFile Route');
})

app.get('/listSaveFiles', function(req, res) {
    console.log('listSaveFiles requested');
    const files = [];
    
    if (!fs.existsSync(path)) {
        res.json({body:'no files', code:200});
    } else {
        console.log('directory exists');
        
        fs.readdirSync(path).forEach(file => {
            files.push(file);
            console.log(file);
            res.json(files);
        })
    }


})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});