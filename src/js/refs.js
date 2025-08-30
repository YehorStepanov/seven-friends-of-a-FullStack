export default {
  exampele: document.querySelector('.exampele'),
  artistsList: document.querySelector('.artists__list'),
  artistsLoadButton: document.querySelector('.artists__load-btn'), //Це приклад як додавати, не видаляйте

  artistModalElems: {
    artistModalEl: document.querySelector('.js-artist-modal'),
    closeArtistModalBtnEl: document.querySelector('[data-artist-modal-close]'),
    artistModalInnerEl: document.querySelector('.js-artist-modal-inner'),
    artistModalBodyEl: document.querySelector('.js-artist-modal-body'),
    artistModalLoaderEl: document.querySelector('.js-artist-modal-loader'),
  },
};
