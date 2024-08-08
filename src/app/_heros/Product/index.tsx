"use client"

import React, { Fragment, useState } from 'react'
import Link from 'next/link'

import { Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { Message } from '../../_components/Message'
import { Price } from '../../_components/Price'
import RichText from '../../_components/RichText'
import { Blocks } from '../../_components/Blocks'

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
    enableSale,
    salePercentage,
    soldOut,
    meta: { image: metaImage, description } = {},
  } = product

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [productImages, setProductImages] = useState<any>(product.productImages)
  const [selectedImage, setSelectedImage] = useState<any | null>(metaImage || null)

  if (!stripeProductID) {
    console.error(`Product ${id} is not connected to Stripe.`)
  }

  const handleImageClick = (image: any) => {
    console.log('image ozannn', image)
    setSelectedImage(image)
  }

  const possibleSizes = ['XS', 'S', 'M', 'L', 'XL']
  const possibleSizes2 = ['28', '30', '32', '34', '36', '38', '40', '42', '44']

  const decidePossibleSizes = (sizes) => {
    if (sizes.length === 0) return []
    if (possibleSizes.includes(sizes[0].title)) return possibleSizes
    if (possibleSizes2.includes(sizes[0].title)) return possibleSizes2
    return []
  }

  const availableSizes = sizes.map(size => size.title)

  const allPossibleSizes = decidePossibleSizes(sizes).map(size => ({
    title: size,
    available: availableSizes.includes(size)
  }))

  return (
    <Fragment>
      <Gutter className={`${classes.productHero} ${soldOut ? classes.soldOut : ''}`}>
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
          <div className={classes.productInfo}>
            <p className={classes.description}>
              {`${description ? `${description} ` : ''}`}
            </p>
            <div className={classes.mediaMobile}>
              <div className={classes.mediaWrapper}>
                {!selectedImage && <div className={classes.placeholder}>No image</div>}
                {selectedImage && selectedImage.id ?(
                  <img className={classes.image} src={selectedImage.url} alt={selectedImage.alt} />
                ) : (
                  <Media imgClassName={classes.image} resource={selectedImage} fill />
                )}
                {enableSale && salePercentage && (<span className={classes.saleBadge}>{salePercentage}% off</span>)}
                {soldOut && (<span className={classes.soldOutBadge}>Sold Out</span>)}
              </div>
            </div>
            {/* Add product images for mobile view here */}
            <div className={classes.productImagesMobile}>
              <div className={classes.carousel}>
                {[metaImage, ...productImages].map((image, index) => (
                  <div
                    key={index}
                    className={classes.carouselImageWrapper}
                    onClick={() => handleImageClick(image)}
                  >
                    {image.id ? (
                      <img
                        className={classes.carouselImage}
                        src={image.url}
                        width={image.width}
                        height={image.height}
                        alt={image.alt}
                      />
                    ) : (
                      <Media
                        imgClassName={classes.carouselImage}
                        resource={image}
                        src={image.url}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {color && (
              <div className={classes.productFeatures}>
                <h5>Color</h5>
                <p>{color.title}</p>
              </div>
            )}
            {allPossibleSizes.length > 0 && (
              <div className={classes.productFeatures}>
                <h5>Sizes</h5>
                <div className={classes.sizeButWrapper}>
                  {allPossibleSizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (size.available) {
                          setSelectedSize(size.title)
                        }
                      }}
                      className={`${classes.sizeButton} ${selectedSize === size.title ? classes.selected : ''}`}
                      disabled={!size.available}
                    >
                      {size.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className={classes.productFeatures}>
              <h5>Price</h5>
              <Price product={product} button={false} enableSale={enableSale} salePercentage={salePercentage} />
            </div>
          </div>
          {soldOut && (
            <span className={classes.soldOutMessage}>
              Sold Out
            </span>
          )}
          {!soldOut && (
            <AddToCartButton
              product={product}
              appearance="default"
              selectedSize={selectedSize}
              onAddToCart={() => setSelectedSize(null)}
              itemHasSize={sizes.length > 0}
            />
          )}
          <div id='productVariations'>
            <Blocks
              disableTopPadding
              blocks={[
                {
                  blockType: 'relatedProducts',
                  blockName: 'Related Product',
                  relationTo: 'products',
                  introContent: [],
                  docs: product.relatedProducts,
                },
              ]}
            />
          </div>
        </div>
        <div className={classes.media}>
          <div className={classes.mediaWrapper}>
            {!selectedImage && <div className={classes.placeholder}>No image</div>}
            {selectedImage && selectedImage.id ? (
              <img className={classes.image} src={selectedImage.url} alt={selectedImage.alt} />
            ) : (
              <Media imgClassName={classes.image} resource={selectedImage} fill />
            )}
            {enableSale && salePercentage && (<span className={classes.saleBadge}>{salePercentage}% off</span>)}
            {soldOut && (<span className={classes.soldOutBadge}>Sold Out</span>)}
          </div>
          {selectedImage && typeof selectedImage !== 'string' && selectedImage?.caption && (
            <RichText content={selectedImage.caption} className={classes.caption} />
          )}
          {/* Product Images below should be displayed above the mid break for desktop */}
          <div className={classes.productImages}>
            <div className={classes.carousel}>
              {[metaImage, ...productImages].map((image, index) => (
                <div
                  key={index}
                  className={classes.carouselImageWrapper}
                  onClick={() => handleImageClick(image)}
                >
                  {image.id ? (
                    <img
                      className={classes.carouselImage}
                      src={image.url}
                      width={image.width}
                      height={image.height}
                      alt={image.alt}
                    />
                  ) : (
                    <Media
                      imgClassName={classes.carouselImage}
                      resource={image}
                      src={image.url}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Gutter>
    </Fragment>
  )
}
