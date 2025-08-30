'use strict';

import { getArtistsList } from './site-api';
import refs from './refs';

let page = 1;

async function createArtistsList(page) {
  try {
    const data = await getArtistsList(page);

    const markup = data.artists
      .map(
        item => `
          <li class="artists__item">
            <img class="artists__image" src="${item.strArtistThumb}" alt="${
          item.strArtist
        }">
            <ul class="artists__genre-list">
              ${item.genres
                .map(g => `<li class="artists__genre-item">${g}</li>`)
                .join('')}
            </ul>
            <h3 class="artists__title-name">${item.strArtist}</h3>
            <p class="artists__text-biography">${item.strBiographyEN}</p>
            <button class="artists__more-btn js-artist-more-btn" data-artists-id="${
              item._id
            }">Learn More</button>
          </li>
        `
      )
      .join('');

    refs.artistsList.insertAdjacentHTML('beforeend', markup);

    if (data.totalArtists > page * data.limit) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    console.error('Error in createArtistsList:', error);
  }
}

createArtistsList(page);

refs.artistsLoadButton.addEventListener('click', () => {
  page += 1;
  createArtistsList(page);
});

function showLoadMoreButton() {
  refs.artistsLoadButton.classList.remove('hidden');
}

function hideLoadMoreButton() {
  refs.artistsLoadButton.classList.add('hidden');
}
