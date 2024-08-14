'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../AddToCartButton'
import { RemoveFromCartButton } from '../RemoveFromCartButton'

import classes from './index.module.scss'

export const priceFromJSON = (priceJSON: string, quantity: number = 1, raw?: boolean): string => {
  let price = ''

  if (priceJSON) {
    try {
      const parsed = JSON.parse(priceJSON)?.data[0]
      const priceValue = parsed.unit_amount * quantity
      const priceType = parsed.type

      if (raw) return priceValue.toString()

      price = (priceValue / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD', // TODO: use `parsed.currency`
      })

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

export const Price: React.FC<{
  product: Product
  quantity?: number
  showSizes?: boolean | false
  button?: 'addToCart' | 'removeFromCart' | false
  enableSale?: boolean
  salePercentage?: number
  soldOut?: boolean
}> = props => {
  const {
    product,
    product: { priceJSON, sizes } = {},
    button = 'addToCart',
    quantity,
    showSizes,
    enableSale,
    salePercentage,
    soldOut,
  } = props

  const [price, setPrice] = useState<{
    actualPrice: string
    withQuantity: string
  }>(() => ({
    actualPrice: priceFromJSON(priceJSON),
    withQuantity: priceFromJSON(priceJSON, quantity),
  }))

  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  useEffect(() => {
    setPrice({
      actualPrice: priceFromJSON(priceJSON),
      withQuantity: priceFromJSON(priceJSON, quantity),
    })
  }, [priceJSON, quantity])

  const handleResetSize = () => {
    // do something after adding to cart
  }

  const possibleSizes = ['XS', 'S', 'M', 'L', 'XL']
  const possibleSizes2 = ['28', '30', '32', '34', '36', '38', '40', '42', '44']

  const decidePossibleSizes = sizes => {
    if (sizes.length === 0) return []
    if (possibleSizes.includes(sizes[0].title)) return possibleSizes
    if (possibleSizes2.includes(sizes[0].title)) return possibleSizes2
    return []
  }

  const availableSizes = sizes.map(size => size.title)

  const allPossibleSizes = decidePossibleSizes(sizes).map(size => ({
    title: size,
    available: availableSizes.includes(size),
  }))

  const calculateOriginalPrice = (price: string, percentage: number): string => {
    const actualPrice = parseFloat(price.replace('$', ''))
    const discount = actualPrice * (percentage / 100)
    return (actualPrice + discount).toFixed(2)
  }

  return (
    <div className={`${classes.actionsWrapper} ${soldOut ? classes.soldOut : ''}`}>
      {showSizes && allPossibleSizes.length > 0 && (
        <div className={classes.sizes}>
          {allPossibleSizes.map((size, index) => (
            <button
              key={index}
              className={`${classes.sizeButton} ${
                selectedSize === size.title ? classes.selected : ''
              }`}
              onClick={() => {
                if (size.available) {
                  setSelectedSize(size.title)
                }
              }}
              disabled={!size.available}
            >
              {size.title}
            </button>
          ))}
        </div>
      )}
      <div className={classes.actions}>
        {typeof price?.actualPrice !== 'undefined' && price?.withQuantity !== '' && (
          <div className={classes.pricesWrapper}>
            {enableSale && salePercentage && (
              <div className={classes.salePrice}>
                <small className={classes.salePrice}>
                  {calculateOriginalPrice(price.actualPrice, salePercentage)}
                </small>
              </div>
            )}
            <div className={classes.price}>
              <p>{price?.withQuantity}</p>
              {quantity > 1 && (
                <small
                  className={classes.priceBreakdown}
                >{`${price.actualPrice} x ${quantity}`}</small>
              )}
            </div>
          </div>
        )}
        {soldOut ? (
          <div className={classes.soldOutMessage}>Sold Out</div>
        ) : (
          <>
            {button && button === 'addToCart' && (
              <AddToCartButton
                product={product}
                appearance="default"
                selectedSize={selectedSize}
                onAddToCart={handleResetSize}
                itemHasSize={sizes.length > 0}
              />
            )}
            {button && button === 'removeFromCart' && <RemoveFromCartButton product={product} />}
          </>
        )}
      </div>
    </div>
  )
}
