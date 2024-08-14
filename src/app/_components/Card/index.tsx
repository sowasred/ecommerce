'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'

import { Product } from '../../../payload/payload-types'
import { Media } from '../Media'
import { Price } from '../Price'

import classes from './index.module.scss'

const priceFromJSON = (priceJSON): string => {
  let price = ''

  if (priceJSON) {
    try {
      const parsed = JSON.parse(priceJSON)?.data[0]
      const priceValue = parsed.unit_amount
      const priceType = parsed.type
      price = `${parsed.currency === 'usd' ? '$' : ''}${(priceValue / 100).toFixed(2)}`
      if (priceType === 'recurring') {
        price += `/${
          parsed.recurring.interval_count > 1
            ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
            : parsed.recurring.interval
        }`
      }
    } catch (e) {
      console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
    }
  }

  return price
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products'
  doc?: Product
  isRelatedProduct?: boolean
  enableSale?: boolean
  salePercentage?: number
  soldOut?: boolean
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: {
      slug,
      title,
      categories,
      meta,
      priceJSON,
      hoverImage,
      enableSale,
      salePercentage,
      soldOut,
    } = {},
    isRelatedProduct,
    className,
  } = props

  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`

  const [
    price, // eslint-disable-line no-unused-vars
    setPrice,
  ] = useState(() => priceFromJSON(priceJSON))

  useEffect(() => {
    setPrice(priceFromJSON(priceJSON))
  }, [priceJSON])

  return (
    <div
      className={
        !isRelatedProduct
          ? [classes.card, className].filter(Boolean).join(' ')
          : classes.relatedProductCard
      }
    >
      <Link href={href} className={classes.mediaWrapper}>
        {enableSale && salePercentage && (
          <span className={classes.saleBadge}>{salePercentage}% off</span>
        )}
        {soldOut && <span className={classes.soldOutBadge}>Sold Out</span>}
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <>
            <Media imgClassName={classes.image} resource={metaImage} fill />
            {hoverImage && typeof hoverImage !== 'string' && (
              <img
                className={`${classes.image} ${classes.hoverImage}`}
                src={hoverImage.url}
                alt={hoverImage.alt}
              />
            )}
          </>
        )}
      </Link>
      <div className={classes.content}>
        {showCategories && hasCategories && (
          <div className={classes.leader}>
            {showCategories && hasCategories && (
              <div>
                {categories?.map((category, index) => {
                  if (typeof category === 'object' && category !== null) {
                    const { title: titleFromCategory } = category

                    const categoryTitle = titleFromCategory || 'Untitled category'

                    const isLast = index === categories.length - 1

                    return (
                      <Fragment key={index}>
                        {categoryTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    )
                  }

                  return null
                })}
              </div>
            )}
          </div>
        )}
        {titleToUse && !isRelatedProduct && (
          <h4 className={classes.title}>
            <Link href={href} className={classes.titleLink}>
              {titleToUse.split('-')[0]}
            </Link>
          </h4>
        )}
        {/* {description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )} */}
        {doc && !isRelatedProduct && (
          <Price
            product={doc}
            showSizes={true}
            enableSale={enableSale}
            salePercentage={salePercentage}
            soldOut={soldOut}
          />
        )}
      </div>
    </div>
  )
}
