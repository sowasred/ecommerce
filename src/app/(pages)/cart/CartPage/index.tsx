'use client'

import React, { Fragment } from 'react'
import Link from 'next/link'

import { Page, Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { HR } from '../../../_components/HR'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { RemoveFromCartButton } from '../../../_components/RemoveFromCartButton'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'

import classes from './index.module.scss'

export const CartPage: React.FC<{
  settings: Settings
  page: Page
}> = props => {
  const { settings } = props
  const { productsPage } = settings || {}

  const { user } = useAuth()
  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()

  const handleQuantityChange = (e, product, size) => {
    const newQuantity = Number(e.target.value)
    if (newQuantity < 1 || newQuantity > 99) return

    addItemToCart({
      product,
      quantity: newQuantity,
      size,
    })
  }

  return (
    <Fragment>
      <br />
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={classes.empty}>
              Your cart is empty.
              {typeof productsPage === 'object' && productsPage?.slug && (
                <Fragment>
                  {' '}
                  <Link href={`/${productsPage.slug}`}>Click here</Link>
                  {` to shop.`}
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  {' '}
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.items}>
              <div className={classes.itemsTotal}>
                {`There ${cart?.items?.length === 1 ? 'is' : 'are'} ${cart?.items?.length} item${
                  cart?.items?.length === 1 ? '' : 's'
                } in your cart.`}
                {!user && (
                  <Fragment>
                    {' '}
                    <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                    {` to save your progress.`}
                  </Fragment>
                )}
              </div>
              {cart?.items?.map((item, index) => {
                if (typeof item.product === 'object') {
                  const {
                    quantity,
                    product,
                    size,
                    product: { id, title, meta, stripeProductID },
                  } = item

                  const isLast = index === (cart?.items?.length || 0) - 1
                  const metaImage = meta?.image
                  if (!stripeProductID) {
                    console.error('stripeProductID is not defined') // eslint-disable-line no-console
                  }

                  return (
                    <Fragment key={index}>
                      <div className={classes.row}>
                        <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
                          {!metaImage && <span className={classes.placeholder}>No image</span>}
                          {metaImage && typeof metaImage !== 'string' && (
                            <Media
                              className={classes.media}
                              imgClassName={classes.image}
                              resource={metaImage}
                              fill
                            />
                          )}
                        </Link>
                        <div className={classes.rowContent}>
                          <h5 className={classes.title}>
                            <Link href={`/products/${product.slug}`} className={classes.titleLink}>
                              {title}
                            </Link>
                          </h5>
                          <div className={classes.actions}>
                            <label>
                              Quantity &nbsp;
                              <input
                                type="number"
                                className={classes.quantity}
                                max={99}
                                min={1}
                                value={quantity ?? ''}
                                onChange={e => handleQuantityChange(e, product, size)}
                                onBlur={e => {
                                  if (e.target.value === '') {
                                    handleQuantityChange({ target: { value: 1 } }, product, size)
                                  }
                                }}
                              />
                            </label>
                            {size && (
                              <label>
                                Size: &nbsp;
                                <span>{size}</span>
                              </label>
                            )}
                            <RemoveFromCartButton product={product} selectedSize={size} />
                          </div>
                          <Price product={product} button={false} quantity={quantity} />
                        </div>
                      </div>
                      {!isLast && <HR />}
                    </Fragment>
                  )
                }
                return null
              })}
              <HR />
              <h5 className={classes.cartTotal}>{`Total: ${cartTotal.formatted}`}</h5>
              <Button
                className={classes.checkoutButton}
                href={user ? '/checkout' : '/login?redirect=%2Fcheckout'}
                label={user ? 'Checkout' : 'Login to checkout'}
                appearance="primary"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
