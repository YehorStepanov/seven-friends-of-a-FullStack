import { renderArtistModal } from './artist-modal-render-function';
import refs from '../refs';
import { debouncedClamp } from './artist-modal-helpers';

const modalRefs = refs.artistModalElems;
let scrollY = 0;

// Artist About Button Click Handler
//! ============================================================================
export const handleAboutArtistBtnClick = e => {
  const isTargetEl = e.target.classList.contains('js-artist-more-btn');
  if (!isTargetEl) return;

  renderArtistModal(e.target.dataset.artistsId);
};

// Modal Handlers
//! ============================================================================
export function openArtistModal() {
  scrollY = window.scrollY;
  document.body.style.top = `-${scrollY}px`;
  document.body.classList.add('scroll-lock');

  modalRefs.artistModalEl.classList.add('artist-modal--is-open');

  document.addEventListener('keydown', handleEscKeydown);
  window.addEventListener('resize', debouncedClamp);
  modalRefs.artistModalEl.addEventListener('click', handleArtistBackdropClick);
  modalRefs.closeArtistModalBtnEl.addEventListener('click', closeArtistModal);

  modalRefs.artistModalBodyEl.scrollTop = 0;
}

export function closeArtistModal() {
  modalRefs.artistModalEl.classList.remove('artist-modal--is-open');
  document.body.classList.remove('scroll-lock');
  const y = Math.abs(parseInt(document.body.style.top || '0', 10));
  document.body.style.top = '';
  window.scrollTo(0, y);

  modalRefs.artistModalInnerEl.innerHTML = '';

  document.removeEventListener('keydown', handleEscKeydown);
  window.removeEventListener('resize', debouncedClamp);
  modalRefs.artistModalEl.removeEventListener(
    'click',
    handleArtistBackdropClick
  );
  modalRefs.closeArtistModalBtnEl.removeEventListener(
    'click',
    closeArtistModal
  );
}

// ESC Key Handler
//! ============================================================================
function handleEscKeydown(e) {
  if (e.key === 'Escape') {
    closeArtistModal();
  }
}

// Backdrop Click Handler
//! ============================================================================
export function handleArtistBackdropClick(e) {
  if (e.target === modalRefs.artistModalEl) {
    closeArtistModal();
  }
}
