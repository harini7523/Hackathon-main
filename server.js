const express = require('express');
const path = require('path')
// const fetch = require('node-fetch')
const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));


const app = express();
const PORT = 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.get('/', (req, res) => {
  res.sendFile('views/pricecheck.html', { root: __dirname })
})

app.get('/get/html_content', async (req, res) => {
  try {
    console.log(req.body.url)
    fetch(req.body.url).then(res => res.text()).then((resdata) => {
      // console.log(resdata);   
      // console.log(extractAmountValues(resdata))
      // console.log(html_content.body)
      console.log(resdata)
      res.status(200).send(resdata)
    })

  } catch (error) {
    console.log(error);
  }
})


app.post('/proxy/search', async (req, res) => {
  const targetUrl = 'https://pricehistory.app/api/search';
  console.log("enter")

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },    
      body: JSON.stringify({ url: req.body.url }),
    });
console.log("after req")
    const data = await response.json();
console.log("after req json")

    console.log(data)
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
