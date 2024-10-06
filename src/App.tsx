import React, { useState, useEffect } from 'react'
import { Filter, TrendingUp, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import MediaList from './components/MediaList'
import MediaDetails from './components/MediaDetails'
import SearchBar from './components/SearchBar'
import FilterMenu from './components/FilterMenu'
import { Movie, TVShow, MovieDetails, TVShowDetails, MediaType, Category, Country } from './types'
import { fetchMediaItems, searchMedia, fetchMediaDetails, fetchCountries } from './services/tmdbApi'

function App() {
  const [mediaType, setMediaType] = useState<MediaType>('movie')
  const [category, setCategory] = useState<Category>('popular')
  const [mediaItems, setMediaItems] = useState<(Movie | TVShow)[]>([])
  const [selectedItem, setSelectedItem] = useState<MovieDetails | TVShowDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState('IN')  // Default to India
  const [countries, setCountries] = useState<Country[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadMediaItems()
    loadCountries()
  }, [mediaType, category, currentPage])

  const loadMediaItems = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { results, total_pages } = await fetchMediaItems(mediaType, category, currentPage)
      setMediaItems(results)
      setTotalPages(total_pages)
    } catch (err) {
      setError(`Failed to fetch ${mediaType} items. Please try again.`)
    }
    setIsLoading(false)
  }

  const loadCountries = async () => {
    try {
      const fetchedCountries = await fetchCountries()
      setCountries(fetchedCountries)
    } catch (err) {
      console.error('Failed to fetch countries:', err)
    }
  }

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { results, total_pages } = await searchMedia(mediaType, query, currentPage)
      setMediaItems(results)
      setTotalPages(total_pages)
    } catch (err) {
      setError(`Failed to search ${mediaType} items. Please try again.`)
    }
    setIsLoading(false)
  }

  const handleItemSelect = async (item: Movie | TVShow) => {
    setIsLoading(true)
    setError(null)
    try {
      const details = await fetchMediaDetails(mediaType, item.id)
      setSelectedItem(details)
    } catch (err) {
      setError(`Failed to fetch ${mediaType} details. Please try again.`)
    }
    setIsLoading(false)
  }

  const handleGoBack = () => {
    setSelectedItem(null)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Indian Media Tracker</h1>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <button
                onClick={() => { setMediaType('movie'); setCurrentPage(1); }}
                className={`mr-4 px-4 py-2 rounded ${mediaType === 'movie' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Movies
              </button>
              <button
                onClick={() => { setMediaType('tv'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded ${mediaType === 'tv' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                TV Shows
              </button>
            </div>
            <div>
              {['popular', 'top_rated', 'upcoming', 'now_playing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat as Category); setCurrentPage(1); }}
                  className={`mr-2 px-3 py-1 rounded ${category === cat ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="mb-6 flex justify-between items-center">
          <FilterMenu
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            countries={countries}
          />
          {selectedItem && (
            <button
              onClick={handleGoBack}
              className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              Go Back
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : selectedItem ? (
          <MediaDetails item={selectedItem} mediaType={mediaType} />
        ) : (
          <>
            <MediaList items={mediaItems} onItemSelect={handleItemSelect} mediaType={mediaType} />
            <div className="mt-6 flex justify-center items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="mr-2 px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-2 px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App