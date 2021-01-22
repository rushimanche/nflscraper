const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

app.listen(port, () => console.log('Listening on http://localhost:' + port));
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

app.get('/api', (req, res) => {
  
  let url = '';
  if (req.query.desc == '') {
    url = 'https://legiscan.com/NJ/legislation';
    url += (req.query.body !== '' ? '?chamber=' + req.query.body : '');
    url += (req.query.type !== '' ? '?type=' + req.query.type : '');
    url += (req.query.status !== '' ? '?status=' + req.query.status : '');
  }
  else {
    url = 'https://legiscan.com/gaits/search?state=NJ&keyword=';
    url += req.query.desc;
  }

  JSDOM.fromURL(url).then(dom => {
    const document = dom.window.document;
    const billCards = document.querySelectorAll('tr');
    const bills = [];
    billCards.forEach(billCard => {
      const billProfile = {
        number: billCard.querySelector('td:nth-child(1)').textContent,
        desc: billCard.querySelector('td:nth-child(3)').textContent,
        date: billCard.querySelector('.gaits-browse-date').textContent,
        url: 'https://legiscan.com/NJ/legislation' + billCard.querySelector('td:nth-child(1)').getAttribute('href'),
      };
      bills.push(billProfile);
    });

    res.send(bills);
  });
});
