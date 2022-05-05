const express = require('express')
const app = express()
const port = 8000

const request = require('request');

const multer = require('multer');
const upload = multer();

const bodyParser = require('body-parser');
app.use(bodyParser.json());   //for parsing aplication json
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.use(upload.array());


let marketData = "";
let coinName = 'bitcoin';
let marketChart = "";


async function resData(coinName) {
    let market_data = await new Promise((resolve, reject) => {
        request('https://api.coingecko.com/api/v3/coins/' + coinName, function (error, response, body) {
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body);
            marketData = JSON.parse(body);
            resolve(marketData)
        });
    })

    if (market_data) {
        var market_chart = await new Promise((resolve, reject) => {
            request('https://api.coingecko.com/api/v3/coins/' + coinName + '/market_chart?vs_currency=usd&days=30', function (error, response, body) {
                console.error('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                // console.log('body:', body);
                marketChart = JSON.parse(body);
                // console.log(marketChart);
                resolve(marketChart)
            });
        })
    }
}


app.get('/', async (req, res) => {
    await resData(coinName)
    res.render('index', { marketData, marketChart, coinName })
})

app.post('/', async (req, res) => {
    coinName = req.body.selectCoin;
    await resData(coinName)
    res.render('index', { marketData, marketChart, coinName })
})


app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})