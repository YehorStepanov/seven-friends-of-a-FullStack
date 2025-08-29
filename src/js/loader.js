'use strict';

export function showLoader(id) {
  document.getElementById(id).classList.remove('hidden');
}

export function hideLoader(id) {
  document.getElementById(id).classList.add('hidden');
}
