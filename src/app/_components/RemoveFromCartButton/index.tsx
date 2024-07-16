import React from 'react'

import { Product } from '../../../payload/payload-types'
import { useCart } from '../../_providers/Cart'

import classes from './index.module.scss'

export const RemoveFromCartButton: React.FC<{
  className?: string
  product: Product
  selectedSize?: string
}> = props => {
  const { className, product, selectedSize } = props

  const { deleteItemFromCart, isProductInCart } = useCart()

  const productIsInCart = isProductInCart(product, selectedSize)

  if (!productIsInCart) {
    return <div>Item is not in the cart</div>
  }

  return (
    <button
      type="button"
      onClick={() => {
        deleteItemFromCart(product, selectedSize)
      }}
      className={[className, classes.removeFromCartButton].filter(Boolean).join(' ')}
    >
      Remove
    </button>
  )
}
