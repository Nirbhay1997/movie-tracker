import axios from 'axios';
import { Movie, TVShow, MovieDetails, TVShowDetails, MediaType, Category, Country } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
    region: 'IN',
  },
});

export const fetchMediaItems = async (mediaType: MediaType, category: Category, page: number = 1): Promise<{ results: (Movie | TVShow)[], total_pages: number }> => {
  try {
    const endpoint = `/${mediaType}/${category}`;
    const params: any = {
      with_original_language: 'hi', // Hindi language
      region: 'IN', // India region
      page,
      sort_by: 'popularity.desc', // Default sort by popularity
    };

    if (category === 'upcoming' && mediaType === 'movie') {
      Object.assign(params, getUpcomingMovieParams());
    }

    const response = await api.get(endpoint, { params });
    return {
      results: response.data.results.map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        overview: item.overview,
        posterPath: item.poster_path,
        voteAverage: item.vote_average,
        popularity: item.popularity,
        ...(mediaType === 'movie'
          ? { releaseDate: item.release_date }
          : { firstAirDate: item.first_air_date, status: item.status }),
      })),
      total_pages: response.data.total_pages,
    };
  } catch (error) {
    console.error('Error fetching media items:', error);
    throw new Error(`Failed to fetch ${mediaType} items. Please try again.`);
  }
};

export const searchMedia = async (mediaType: MediaType, query: string, page: number = 1): Promise<{ results: (Movie | TVShow)[], total_pages: number }> => {
  try {
    const response = await api.get('/search/' + mediaType, {
      params: { 
        query,
        with_original_language: 'hi', // Hindi language
        region: 'IN', // India region
        page,
        sort_by: 'popularity.desc', // Default sort by popularity
      },
    });
    return {
      results: response.data.results.map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        overview: item.overview,
        posterPath: item.poster_path,
        voteAverage: item.vote_average,
        popularity: item.popularity,
        ...(mediaType === 'movie'
          ? { releaseDate: item.release_date }
          : { firstAirDate: item.first_air_date, status: item.status }),
      })),
      total_pages: response.data.total_pages,
    };
  } catch (error) {
    console.error('Error searching media:', error);
    throw new Error(`Failed to search ${mediaType} items. Please try again.`);
  }
};

export const fetchMediaDetails = async (mediaType: MediaType, id: number): Promise<MovieDetails | TVShowDetails> => {
  try {
    const response = await api.get(`/${mediaType}/${id}`, {
      params: {
        append_to_response: 'videos,images',
      },
    });
    const data = response.data;
    return {
      id: data.id,
      title: data.title || data.name,
      overview: data.overview,
      posterPath: data.poster_path,
      voteAverage: data.vote_average,
      popularity: data.popularity,
      videos: data.videos.results,
      images: {
        backdrops: data.images.backdrops,
        posters: data.images.posters,
      },
      ...(mediaType === 'movie'
        ? {
            releaseDate: data.release_date,
            runtime: data.runtime,
            genres: data.genres.map((genre: any) => genre.name),
          }
        : {
            firstAirDate: data.first_air_date,
            status: data.status,
            nextEpisodeToAir: data.next_episode_to_air,
          }),
    };
  } catch (error) {
    console.error('Error fetching media details:', error);
    throw new Error(`Failed to fetch ${mediaType} details. Please try again.`);
  }
};

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await api.get('/configuration/countries');
    return response.data.map((country: any) => ({
      code: country.iso_3166_1,
      name: country.english_name,
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('Failed to fetch countries. Please try again.');
  }
};

// Helper functions
const getUpcomingMovieParams = () => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  return {
    'primary_release_date.gte': today.toISOString().split('T')[0],
    'primary_release_date.lte': nextMonth.toISOString().split('T')[0],
  };
};