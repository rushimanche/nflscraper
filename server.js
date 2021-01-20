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
    const userCards = document.querySelectorAll('.user-card');
    const profiles = [];

    userCards.forEach(userCard => {
      const userProfile = {
        name: userCard.querySelector('.user-card-caption__name').textContent,
        photoUrl: userCard.querySelector('.user-card__img').getAttribute('src'),
        photoCounter: userCard.querySelector('.photo-counter__text').textContent,
        url: 'https://badoo.com' + userCard.querySelector('.user-card__link').getAttribute('href'),
        location: userCard.querySelector('.user-card__location').textContent,
      };

      if (names.includes(userProfile.name) || names === '') {
        profiles.push(userProfile);
      }
    });

    res.send(profiles);
  });
});
