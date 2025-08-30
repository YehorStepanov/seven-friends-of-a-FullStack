import { getArtistDataAndAlbums } from '../site-api';
import { openArtistModal } from './artist-modal-handlers';
import {
  clampArtistBio,
  convertTrackDuration,
  filterAlbums,
  getActiveYears,
  isValidLink,
  showErrorMessage,
} from './artist-modal-helpers';
import refs from '../refs';

const modalRefs = refs.artistModalElems;

// Modal Renderer
//! ============================================================================

/** Opens artist modal and renders artist info with albums */
export async function renderArtistModal(id) {
  openArtistModal();
  showLoader();

  try {
    const artistData = await getArtistDataAndAlbums(id);
    const { albumsList } = artistData;

    createArtistAbout(artistData);
    const filteredAlbums = filterAlbums(albumsList, true);
    createArtistAlbums(filteredAlbums);

    setTimeout(clampArtistBio, 0);
  } catch (error) {
    showErrorMessage(error.message);
  } finally {
    hideLoader();
  }
}

// Artist Info Templates
//! ============================================================================

/** Returns markup for artist about section */
const aboutArtistTemplate = item => {
  const {
    strArtist,
    strArtistThumb,
    intFormedYear,
    intDiedYear = '',
    strGender,
    intMembers,
    strCountry,
    strBiographyEN,
    genres,
  } = item;

  const activeYears = getActiveYears({ intFormedYear, intDiedYear });
  const isBand = intMembers && intMembers > 1;

  const artistInfoList = [
    { title: 'Years active', key: 'activeYears', value: activeYears },
    { title: 'Sex', key: 'strGender', value: strGender, isBand: isBand },
    { title: 'Members', key: 'intMembers', value: intMembers, isBand: isBand },
    { title: 'Country', key: 'strCountry', value: strCountry },
    { title: 'Biography', key: 'strBiographyEN', value: strBiographyEN },
  ];

  const artistInfoListMarkUp = createArtistInfoList(artistInfoList);
  const musicGenresMarkUp = createMusicGenresList(genres);

  return `<section class="about-artist js-about-artist">
                <h2 class="about-artist__title">${strArtist}</h2>
                <div class="about-artist__content">
                    <img
                    src="${strArtistThumb}"
                    class="about-artist__image"
                    alt="${strArtist}"
                    />
                    <ul class="about-artist__info-list">
                        ${artistInfoListMarkUp}
                        <li class="about-artist__info-item--genres">
                          <ul class="about-artist__music-genres">
                             ${musicGenresMarkUp}
                          </ul>
                        </li>
                    </ul>
                </div>
            </section>`;
};

/** Returns markup for one artist info list item */
function artistInfoItemTemplate(item) {
  const { key, value, title, isBand = '' } = item;
  if (key === 'strGender' && isBand) return '';
  if (key === 'intMembers' && !isBand) return '';

  const itemClass =
    key === 'strBiographyEN'
      ? 'about-artist__info-item about-artist__info-item--bio'
      : 'about-artist__info-item';
  const itemMarkup = `<li class="${itemClass}">
                           <b class="about-artist__info-item-title">${title}</b>
                           <p class="about-artist__info-item-text">${value}</p>
                        </li>`;
  return value ? itemMarkup : '';
}

/** Builds artist info list markup */
function createArtistInfoList(items) {
  return items.map(artistInfoItemTemplate).join('\n');
}

// Artist Genres
//! ============================================================================

/** Returns markup for one genre item */
const musicGenreTemplate = genre =>
  `<li class="about-artist__music-genre">${genre}</li>`;

/** Builds genres list markup */
function createMusicGenresList(items) {
  const hasGenres = items?.length > 0;
  const markup = hasGenres ? items.map(musicGenreTemplate).join('\n') : '';
  return markup;
}

// Artist About Section
//! ============================================================================

/** Inserts artist about section into modal */
const createArtistAbout = artist => {
  const markup = aboutArtistTemplate(artist);
  modalRefs.artistModalInnerEl.insertAdjacentHTML('afterbegin', markup);
};

// Artist Albums
//! ============================================================================

/** Inserts artist albums section into modal */
const createArtistAlbums = artist => {
  const markup = artistAlbumListTemplate(artist);
  modalRefs.artistModalInnerEl.insertAdjacentHTML('beforeend', markup);
};

/** Returns albums section markup */
function artistAlbumListTemplate(items) {
  const albumsList = artistAlbumsTemplate(items);

  return `<section class="artist-albums js-artist-modal-albums">
            <h2 class="artist-albums__title">Albums</h2>
            <ul class="artist-albums__list js-artist-albums">
              ${albumsList}
            </ul>
          </section>`;
}

/** Builds albums list markup */
function artistAlbumsTemplate(albums) {
  return albums.map(artistAlbumItemTemplate).join('\n');
}

/** Returns markup for one album */
function artistAlbumItemTemplate(album) {
  const { strAlbum = '', tracks } = album;
  const tracksList = tracks?.length > 0 ? tracksTemplate(tracks) : '';

  return `<li class="artist-album">
            <h3 class="artist-album__title">${strAlbum}</h3>
            <div class="artist-album__tracks">
              <ul class="artist-tracks__header">
                <li class="artist-tracks__header-item header-track">Track</li>
                <li class="artist-tracks__header-item header-duration">Time</li>
                 <li class="artist-tracks__header-item header-link">Link</li>
              </ul>
              <ul class="artist-tracks__list">
                ${tracksList}
              </ul>
            </div>
          </li>`;
}

// Artist Album Tracks
//! ============================================================================

/** Returns markup for one track */
function artistAlbumTrackTemplate(item) {
  const { strTrack, intDuration, movie } = item;
  const movieMarkUp = movieTemplate(movie);
  const duration = convertTrackDuration(intDuration);

  return `<li class="artist-tracks__item">
            <span class="artist-tracks__item-name">${strTrack}</span>
            <span class="artist-tracks__item-duration">${duration}</span>
            ${movieMarkUp}
          </li>`;
}

/** Builds tracks list markup */
function tracksTemplate(items) {
  return items.map(artistAlbumTrackTemplate).join('\n');
}

// Track Movie Links
//! ============================================================================

/** Returns YouTube link markup if valid */
function movieTemplate(movie) {
  if (!isValidLink(movie)) return '';

  const markup = `<a href="${movie}" target="_blank" rel="noopener noreferrer" class="artist-tracks__item-link">
                          <svg class="artist-tracks__item-icon" width="21" height="15">
                            <use href="../img/sprite.svg#icon-Youtube"></use>
                          </svg>
                      </a>`;
  return markup;
}

// Modal Loader
//! ============================================================================

/** Shows loader inside modal */
export const showLoader = () => {
  modalRefs.artistModalLoaderEl.classList.add('modal-loader-visible');
};

/** Hides loader inside modal */
export const hideLoader = () => {
  modalRefs.artistModalLoaderEl.classList.remove('modal-loader-visible');
};
