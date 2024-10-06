import React from 'react'
import { Show } from '../types'

interface ShowListProps {
  shows: Show[]
  onShowSelect: (show: Show) => void
}

const ShowList: React.FC<ShowListProps> = ({ shows, onShowSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shows.map(show => (
        <div 
          key={show.id} 
          className="bg-gray-50 p-4 rounded-md shadow cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => onShowSelect(show)}
        >
          <h3 className="text-lg font-semibold">{show.title}</h3>
          <p className="text-sm text-gray-600">{show.platform}</p>
          <p className="text-sm text-gray-600">Release Date: {show.releaseDate}</p>
          <span className={`text-sm ${show.status === 'Released' ? 'text-green-600' : 'text-blue-600'}`}>
            {show.status}
          </span>
          <p className="text-sm mt-2">{show.overview}</p>
          <p className="text-sm mt-1">Popularity: {show.popularity.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

export default ShowList