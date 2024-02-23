import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const api_url = "https://api.coinranking.com/v2/coins";
const api_key = "coinrankingc03656e9e7050e4a5732e484c8a091e5e290f09bffe2f713";

const options = {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': `${api_key}`
    },
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(api_url + "?scopeId=marketCap&scopeLimit=3&orderBy=marketCap", options);
        const first = response.data.data.coins[0];
        const second = response.data.data.coins[1];
        const third = response.data.data.coins[2];
        const price1 = first.price;
        const price2 = second.price;
        const price3 = third.price;
        function money_round (num) {
            return Math.ceil(num * 100) / 100;
        }
        const first_price = money_round(price1);
        console.log(first_price);
        const second_price = money_round(price2);
        const third_price = money_round(price3);
        res.render('index.ejs', {
            first: first,
            second: second, 
            third: third,
            fPrice: first_price,
            sPrice: second_price,
            tPrice: third_price
        });
    }  catch (err) {
        console.log(err.message);
        res.render('index.ejs', {first: 'undefined', second: 'undefined', third: 'undefined'})
    }
});

app.post('/search', async (req, res) => {
    const search = req.body.name;
    try {
        const response = await axios.get(api_url + "?search=" + search, options);
        const topRes = await axios.get(api_url + "?scopeId=marketCap&scopeLimit=3&orderBy=marketCap", options);
        const first = topRes.data.data.coins[0];
        const second = topRes.data.data.coins[1];
        const third = topRes.data.data.coins[2];
        const user = response.data.data.coins[0]
        const price1 = first.price;
        const price2 = second.price;
        const price3 = third.price;
        function money_round (num) {
            return Math.ceil(num * 100) / 100;
        }
        const first_price = money_round(price1);
        const second_price = money_round(price2);
        const third_price = money_round(price3);
        const user_price = money_round(user.price)
        res.render('index.ejs', {
            user: user,
            first: first,
            second: second,
            third: third,
            uPrice: user_price,
            fPrice: first_price,
            sPrice: second_price,
            tPrice: third_price
        });
    } catch (err) {
        console.log(err.message);
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});