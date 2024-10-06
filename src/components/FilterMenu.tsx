import React from 'react'
import { Filter } from 'lucide-react'
import { Country } from '../types'

interface FilterMenuProps {
  selectedCountry: string
  setSelectedCountry: (country: string) => void
  countries: Country[]
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  selectedCountry,
  setSelectedCountry,
  countries
}) => {
  return (
    <div className="flex items-center space-x-4">
      <Filter className="text-gray-600" size={20} />
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {countries.map(country => (
          <option key={country.code} value={country.code}>{country.name}</option>
        ))}
      </select>
    </div>
  )
}

export default FilterMenu