import React from 'react'
import { Movie, TVShow, MediaType } from '../types'

interface MediaListProps {
  items: (Movie | TVShow)[]
  onItemSelect: (item: Movie | TVShow) => void
  mediaType: MediaType
}

const MediaList: React.FC<MediaListProps> = ({ items, onItemSelect, mediaType }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <div 
          key={item.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => onItemSelect(item)}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
            alt={item.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 truncate">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {mediaType === 'movie' 
                ? `Release: ${(item as Movie).releaseDate}`
                : `First Air: ${(item as TVShow).firstAirDate}`
              }
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-600">
                ★ {item.voteAverage.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                Popularity: {item.popularity.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MediaList