import React from 'react';
import { ShowDetails } from '../types';

interface ShowDetailsProps {
  show: ShowDetails;
}

const ShowDetailsComponent: React.FC<ShowDetailsProps> = ({ show }) => {
  const trailer = show.videos.find(video => video.type === 'Trailer');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'returning series':
        return 'text-green-600';
      case 'in production':
        return 'text-yellow-600';
      case 'planned':
        return 'text-blue-600';
      case 'canceled':
        return 'text-red-600';
      case 'ended':
        return 'text-gray-600';
      default:
        return 'text-black';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{show.title}</h2>
      <div className="flex flex-wrap mb-4">
        <img
          src={`https://image.tmdb.org/t/p/w300${show.posterPath}`}
          alt={`${show.title} poster`}
          className="w-1/3 rounded-md mr-4 mb-4"
        />
        <div className="w-2/3">
          <p className="mb-2"><strong>First Air Date:</strong> {show.firstAirDate}</p>
          <p className="mb-2">
            <strong>Status:</strong> 
            <span className={`ml-2 ${getStatusColor(show.status)}`}>
              {show.status}
            </span>
          </p>
          <p className="mb-2"><strong>Rating:</strong> {show.voteAverage.toFixed(1)}/10</p>
          <p className="mb-2"><strong>Popularity:</strong> {show.popularity.toFixed(2)}</p>
          {show.nextEpisodeToAir && (
            <p className="mb-2">
              <strong>Next Episode:</strong> {new Date(show.nextEpisodeToAir.air_date).toLocaleDateString()}
            </p>
          )}
          <p className="mb-4">{show.overview}</p>
        </div>
      </div>
      {trailer && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Trailer</h3>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={trailer.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {show.images.backdrops.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Images</h3>
          <div className="flex overflow-x-auto">
            {show.images.backdrops.slice(0, 5).map((image, index) => (
              <img
                key={index}
                src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                alt={`${show.title} backdrop ${index + 1}`}
                className="w-64 h-36 object-cover rounded-md mr-2"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowDetailsComponent;