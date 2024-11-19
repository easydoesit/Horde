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

app.post('/saveFile', jsonParser, function (req, res) {
    const body = req.body;
    console.log(body);
    const saveFileJSON = JSON.stringify(body);

    fs.writeFile('public/saveFiles/saveFile.json', saveFileJSON, (error) => {
        if(error) {
            console.log(error);
        } else {
            console.log('file Written')
        };
    });
    console.log(body);
    res.json('you got the saveFile Route');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});