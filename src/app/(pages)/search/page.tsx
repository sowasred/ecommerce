'use client'

import React, { useState, useEffect } from 'react'
import { Gutter } from '../../_components/Gutter'
import { CollectionArchive } from '../../_components/CollectionArchive'
import classes from './index.module.scss'

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setLoading(true)
        setSearchResults(searchTerm)
      } else {
        setLoading(false)
        setSearchResults(null)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  return (
    <Gutter className={classes.search}>
      <h1>Search</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for products..."
        className={classes.searchInput}
      />
      {loading && <p>Loading...</p>}
      {searchResults && (
        <CollectionArchive
          key={searchResults} // This ensures the component re-renders on search term change
          populateBy="collection"
          relationTo="products"
          sort="-createdAt"
          limit={9}
          searchTerm={searchResults}
          setLoading={setLoading}
          loading={loading}
        />
      )}
    </Gutter>
  )
}
