const searchFormDOM = document.getElementById('search-form');
const searchButtonDOM = searchFormDOM.querySelector('[name="search-button"]');
const stopButtonDOM = searchFormDOM.querySelector('[name="stop-button"]');
const searchResultsDOM = document.querySelector('.search-result');
const ageSliderDOM = document.getElementById('age-slider');

searchFormDOM.addEventListener('submit', e => {
  e.preventDefault();
  searchButtonDOM.disabled = true;
  stopButtonDOM.disabled = false;
  searchResultsDOM.innerHTML = '';
  search(1, getLocation(), getAge(), getSex(), getNames());
});

stopButtonDOM.addEventListener('click', e => {
  e.preventDefault();
  searchButtonDOM.disabled = false;
  stopButtonDOM.disabled = true;
  searchButtonDOM.textContent = 'Search';
})

function search(page, location, age, sex, names) {
  const url = '/api/?page=' + page + '&location=' + location + '&age=' + age + '&sex=' + sex + '&names=' + names;
  searchButtonDOM.textContent = `Searching... (${page})`;

  fetch(url).then(res => res.json()).then(data => {
    data.forEach(profile => {
      searchResultsDOM.insertAdjacentHTML('beforeend', `
        <a href="${profile.url}" class="user-card">
          <div class="user-card__photo">
            <img src="${profile.photoUrl}" alt="${profile.name}" title="${profile.name}">
            <span class="user-card__photo__counter">${profile.photoCounter}</span>
          </div>
          <p class="user-card__name">${profile.name}</p>
          <p class="user-card__location">${profile.location}</p>
        </a>
      `);
    });

    if (!stopButtonDOM.disabled) {
      search(++page, location, age, sex, names);
    }
  });
}

function getSex() {
  const sexCheckboxes = searchFormDOM.querySelectorAll('[name="sex[]"]:checked');
  let sex = '';

  if (sexCheckboxes.length === 1) {
    sex = sexCheckboxes[0].value;
  }

  return sex;
}

function getNames() {
  return searchFormDOM.querySelector('#input-names').value;
}

function getLocation() {
  return searchFormDOM.querySelector('#input-location').value;
}

function getAge() {
  const ageSliderValues = ageSliderDOM.noUiSlider.get();
  return ageSliderValues.join('-');
}

noUiSlider.create(ageSliderDOM, {
  start: [20, 30],
  connect: true,
  tooltips: true,
  margin: 4,
  step: 1,
  format: {
    from: value => parseInt(value),
    to: value => parseInt(value),
  },
  range: {
    'min': 18,
    'max': 80
  }
});
