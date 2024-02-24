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
        const response = await axios.get(api_url + "?scopeId=marketCap&scopeLimit=10&orderBy=marketCap", options);
      
        var coin = [];
        var price = [];
        var volume = [];
      
        function money_round (num) {
            return Math.ceil(num * 100) / 100;
        }

        for (let i = 0; i < 10; i++) {
          coin[i] = response.data.data.coins[i];
          price[i] = money_round(response.data.data.coins[i].price);
          volume[i] = response.data.data.coins[i]['24hVolume'];
        };
      
      
        res.render('index.ejs', {
            coin: coin,
            price: price,
            volume: volume
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
        const topRes = await axios.get(api_url + "?scopeId=marketCap&scopeLimit=10&orderBy=marketCap", options);
  
        var coin = [];
        var price = [];
        var volume = [];

        function money_round (num) {
            return Math.ceil(num * 100) / 100;
        }

      for (let i = 0; i < 10; i++) {
        coin[i] = topRes.data.data.coins[i];
        price[i] = money_round(topRes.data.data.coins[i].price);
        volume[i] = topRes.data.data.coins[i]['24hVolume'];
      };
      
        const user = response.data.data.coins[0]
        const user_price = money_round(user.price);

        res.render('index.ejs', {
            user: user,
            user_price: user_price,
            coin: coin,
            price: price,
            volume: volume
        });
    } catch (err) {
        console.log(err.message);
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});