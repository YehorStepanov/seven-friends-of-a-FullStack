import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import spriteUrl from '../../img/sprite.svg';

let resizeTimeout;

// Artist Info Helpers
//! ============================================================================

/** Returns artist active years string */
export const getActiveYears = ({ intFormedYear, intDiedYear = '' }) => {
  let result = '—';
  const formed = Number(intFormedYear);
  const died = Number(intDiedYear);

  if (!formed) {
    result = 'information missing';
  } else if (!intDiedYear) {
    result = `${formed}-present`;
  } else if (died >= formed) {
    result = `${formed}-${died}`;
  }

  return result;
};

/** Defines number of lines for bio depending on screen width */
const getLinesForScreen = () => {
  if (window.matchMedia('(min-width: 1440px)').matches) return 5;
  if (window.matchMedia('(min-width: 768px)').matches) return 4;
  return 11;
};

/** Clamps artist bio text to fit screen and adds "..." if truncated */
export const clampArtistBio = () => {
  const el = document.querySelector(
    '.about-artist__info-item--bio .about-artist__info-item-text'
  );
  if (!el) return;

  if (!el.dataset.fullText) el.dataset.fullText = el.textContent.trim();
  const fullText = el.dataset.fullText;

  el.style.visibility = 'hidden';
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
  const maxLines = getLinesForScreen();
  const maxHeight = lineHeight * maxLines;

  let words = fullText.split(' ');
  let truncated = fullText;
  el.textContent = truncated;

  while (el.scrollHeight > maxHeight && words.length > 0) {
    words.pop();
    truncated = words.join(' ');
    el.textContent = truncated + '...';
  }

  el.style.maxHeight = `${maxHeight}px`;
  el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  el.style.visibility = 'visible';
};

export function debouncedClamp() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(clampArtistBio, 150);
}

// Album & Track Helpers
//! ============================================================================

/** Converts track duration from ms to M:SS format */
export function convertTrackDuration(ms) {
  if (ms == null) return '0:00';

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Removes empty tracks and albums without valid tracks */
export function filterAlbums(albums, hideEmptyAlbums = true) {
  return albums.reduce((acc, album) => {
    const validTracks = album.tracks.filter(
      track => Number(track.intDuration) > 0 && track.strTrack?.trim()
    );

    if (hideEmptyAlbums && validTracks.length === 0) return acc;

    acc.push({ ...album, tracks: validTracks });
    return acc;
  }, []);
}

// Validation Helpers
//! ============================================================================

/** Checks if a string is a valid http/https link */
export function isValidLink(link) {
  if (typeof link !== 'string' || link.trim() === '') return false;

  try {
    const url = new URL(link);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Notifications
//! ============================================================================

/** Displays a custom error toast with icons */
export function showErrorMessage(text) {
  iziToast.error({
    message: text,
    position: 'topRight',
    class: 'custom-error-toast',
    timeout: 5000,
    onOpening: (instance, toast) => {
      const body = toast.querySelector('.iziToast-body');
      if (body) {
        const iconWrapper = document.createElement('span');
        iconWrapper.classList.add('iziToast-icon');
        iconWrapper.innerHTML = `
          <svg class="toast-error-icon" width="24" height="24">
            <use xlink:href="${spriteUrl}#icon-toast-error"></use>
          </svg>
        `;
        body.prepend(iconWrapper);
      }

      const closeBtn = toast.querySelector('.iziToast-close');
      if (closeBtn) {
        closeBtn.innerHTML = `
          <svg class="toast-close-icon" width="16" height="16">
            <use xlink:href="${spriteUrl}#icon-toast-close"></use>
          </svg>
        `;
      }
    },
  });
}
