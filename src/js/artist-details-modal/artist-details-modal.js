import refs from '../refs';
import { handleAboutArtistBtnClick } from './artist-modal-handlers';

const { artistsList } = refs;

// Event Listener: Open Artist Modal
//! ============================================================================
artistsList.addEventListener('click', handleAboutArtistBtnClick);
