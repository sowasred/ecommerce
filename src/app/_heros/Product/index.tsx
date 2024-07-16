'use client'

import React, { Fragment, useState } from 'react'
import Link from 'next/link'

import { Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { Message } from '../../_components/Message'
import { Price } from '../../_components/Price'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const ProductHero: React.FC<{
  product: Product
}> = ({ product }) => {
  const {
    id,
    stripeProductID,
    title,
    categories,
    color,
    sizes,
    meta: { image: metaImage, description } = {},
  } = product

  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  return (
    <Fragment>
      {!stripeProductID && (
        <Gutter>
          <Message
            className={classes.warning}
            warning={
              <Fragment>
                {'This product is not yet connected to Stripe. To link this product, '}
                <Link
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/products/${id}`}
                >
                  edit this product in the admin panel
                </Link>
                {'.'}
              </Fragment>
            }
          />
        </Gutter>
      )}
      <Gutter className={classes.productHero}>
        <div className={classes.content}>
          <div className={classes.categories}>
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {titleToUse}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </div>
          <h1 className={classes.title}>{title.split('-')[0]}</h1>
          <div>
            <p className={classes.description}>
              {`${description ? `${description} ` : ''}`}
            </p>
            {
              color && (
                <div className={classes.productFeatures}>
                  <h5>Color</h5>
                  <p>{color.title}</p>
                </div>
              )
            }
            {
              sizes && sizes.length && (
                <div className={classes.productFeatures}>
                  <h5>Sizes</h5>
                  <div className={classes.sizeButWrapper}>
                    {sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size.title)}
                        className={`${classes.sizeButton} ${selectedSize === size.title ? classes.selected : ''}`}
                      >
                        {size.title}
                      </button>
                    ))}
                  </div>
                </div>
              )
            }
            <div className={classes.productFeatures}>
              <h5>Price</h5>
              <Price product={product} button={false} />
            </div>
          </div>
          <AddToCartButton product={product} selectedSize={selectedSize} className={classes.addToCartButton} />
        </div>
        <div className={classes.media}>
          <div className={classes.mediaWrapper}>
            {!metaImage && <div className={classes.placeholder}>No image</div>}
            {metaImage && typeof metaImage !== 'string' && (
              <Media imgClassName={classes.image} resource={metaImage} fill />
            )}
          </div>
          {metaImage && typeof metaImage !== 'string' && metaImage?.caption && (
            <RichText content={metaImage.caption} className={classes.caption} />
          )}
        </div>
      </Gutter>
    </Fragment>
  )
}
