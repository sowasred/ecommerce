import React from 'react'

import classes from './index.module.scss'

const defaultLabels = {
  plural: 'Docs',
  singular: 'Doc',
}

const defaultCollectionLabels = {
  posts: {
    plural: 'Products',
    singular: 'Product',
  },
}

interface PageRangeProps {
  className?: string
  collection?: string
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
  loading?: boolean
}

export const PageRange: React.FC<PageRangeProps> = props => {
  const {
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage = 1,
    limit = 1,
    totalDocs,
    loading,
    className,
  } = props

  let indexStart = (currentPage - 1) * limit + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = currentPage * limit
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const { plural, singular } =
    collectionLabelsFromProps || defaultCollectionLabels[collection || ''] || defaultLabels

  return (
    <div className={[className, classes.pageRange].filter(Boolean).join(' ')}>
      {!loading &&
        (typeof totalDocs === 'undefined' || totalDocs === 0) &&
        'Search produced no results.'}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        `Showing ${indexStart}${indexStart > 0 ? ` - ${indexEnd}` : ''} of ${totalDocs} ${
          totalDocs > 1 ? plural : singular
        }`}
    </div>
  )
}
