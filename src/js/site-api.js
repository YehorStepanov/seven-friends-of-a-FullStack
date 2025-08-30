'use strict';

import axios from 'axios';

axios.defaults.baseURL = 'https://sound-wave.b.goit.study/api/';

export async function getArtistsList(page = 1) {
  try {
    const { data } = await axios.get('artists', {
      params: {
        limit: 8,
        page,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching artists:', error.message);
    throw error;
  }
}

// Fetch artist data and albums by artist ID
//! ============================================================================
export const getArtistDataAndAlbums = async id => {
  const res = await axios.get(`artists/${id}/albums`);
  return res.data;
};
