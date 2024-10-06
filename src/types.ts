export interface MediaItem {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  voteAverage: number;
  popularity: number;
}

export interface Movie extends MediaItem {
  releaseDate: string;
}

export interface TVShow extends MediaItem {
  firstAirDate: string;
  status: string;
}

export interface MediaDetails extends MediaItem {
  videos: Video[];
  images: {
    backdrops: Image[];
    posters: Image[];
  };
}

export interface MovieDetails extends MediaDetails, Movie {
  runtime: number;
  genres: string[];
}

export interface TVShowDetails extends MediaDetails, TVShow {
  nextEpisodeToAir?: {
    air_date: string;
    episode_number: number;
    season_number: number;
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Image {
  file_path: string;
  width: number;
  height: number;
}

export interface Country {
  code: string;
  name: string;
}

export type MediaType = 'movie' | 'tv';
export type Category = 'now_playing' | 'popular' | 'top_rated' | 'upcoming';

export type SearchType = 'text' | 'discover' | 'external';

export interface SearchParams {
  type: SearchType;
  mediaType: MediaType;
  query?: string;
  discoverParams?: Record<string, string>;
  externalId?: string;
  externalSource?: string;
}