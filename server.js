const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

app.listen(port, () => console.log('Listening on http://localhost:' + port));
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

app.get('/api', (req, res) => {
  let url = 'https://legiscan.com/NJ/legislation';

  url += '?' + req.query.location;
  url += (req.query.sex !== '' ? '/' + req.query.sex : '');
  url += '/page-' + req.query.page;
  url += '/age-' + req.query.age;
  url += '/';

  let names = req.query.names;

  if (names !== '') {
    names = names.split(',');
    names = names.map(name => name.trim());
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
