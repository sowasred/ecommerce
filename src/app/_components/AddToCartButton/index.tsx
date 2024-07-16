'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useCart } from '../../_providers/Cart'
import { Button, Props } from '../Button'

import classes from './index.module.scss'

export const AddToCartButton: React.FC<{
  product: Product
  selectedSize: string | null
  quantity?: number
  className?: string
  appearance?: Props['appearance']
}> = props => {
  const { product, selectedSize, quantity = 1, className, appearance = 'primary' } = props

  const { cart, addItemToCart, isProductInCart, hasInitializedCart } = useCart()

  const [isInCart, setIsInCart] = useState<boolean>()
  const router = useRouter()

  useEffect(() => {
    if(selectedSize) {
      setWarning(null)
    }
    setIsInCart(isProductInCart(product, selectedSize))
  }, [isProductInCart, product, cart, selectedSize])

  const [warning, setWarning] = useState<string | null>(null)

  const handleAddToCart = () => {
    if (!selectedSize) {
      setWarning('Please select a size.')
      return
    }

    addItemToCart({
      product,
      quantity,
      size: selectedSize,
    })

    router.push('/cart')
  }

  return (
    <div className={classes.addToCartButWrapper}>
      {warning && <div className={classes.warning}>{warning}</div>}
      <Button
        href={isInCart ? '/cart' : undefined}
        type={!isInCart ? 'button' : undefined}
        label={isInCart ? `✓ View in cart` : `Add to cart`}
        el={isInCart ? 'link' : undefined}
        appearance={appearance}
        className={[
          className,
          classes.addToCartButton,
          appearance === 'default' && isInCart && classes.green,
          !hasInitializedCart && classes.hidden,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={
          !isInCart
            ? handleAddToCart
            : undefined
        }
      />
    </div>
  )
}
