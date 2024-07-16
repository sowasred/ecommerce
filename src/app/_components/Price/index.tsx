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
}> = props => {
  const { product, product: { priceJSON, sizes } = {}, button = 'addToCart', quantity, showSizes } = props

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

  return (
    <div className={classes.actionsWrapper}>
      {showSizes && sizes && sizes.length > 0 && (
        <div className={classes.sizes}>
            {sizes.map((size, index) => (
              <button
                key={index}
                className={`${classes.sizeButton} ${selectedSize === size.title ? classes.selected : ''}`}
                onClick={() => {
                  setSelectedSize(size.title)
                }}
              >
                {size.title}
              </button>
            ))}
        </div>
      )}
      <div className={classes.actions}>
      {typeof price?.actualPrice !== 'undefined' && price?.withQuantity !== '' && (
        <div className={classes.price}>
          <p>{price?.withQuantity}</p>
          {quantity > 1 && (
            <small className={classes.priceBreakdown}>{`${price.actualPrice} x ${quantity}`}</small>
          )}
        </div>
      )}
      {button && button === 'addToCart' && (
        <AddToCartButton product={product} appearance="default" selectedSize={selectedSize} />
      )}
      {button && button === 'removeFromCart' && <RemoveFromCartButton product={product} />}
    </div>
    </div>
  )
}
