'use client'

import React, { useState, useEffect } from 'react'
import { Gutter } from '../../_components/Gutter'
import { fetchDocs } from '../../_api/fetchDocs'
import { Product } from '../../../payload/payload-types'
import classes from './index.module.scss'

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const results = await fetchDocs<Product>('products', false, searchTerm)
      setProducts(results)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        handleSearch()
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setProducts([])
    }
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
      {!loading && products.length === 0 && searchTerm && <p>No products found.</p>}
      <div className={classes.results}>
        {products.map(product => (
          <div key={product.id} className={classes.product}>
            <h2>{product.title}</h2>
          </div>
        ))}
      </div>
    </Gutter>
  )
}
