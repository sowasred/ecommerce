import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, MEDIA_BLOCK } from './blocks'
import { CATEGORIES } from './categories'
import { COLOR } from './color'
import { META } from './meta'
import { SIZES } from './sizes'

export const PRODUCTS = `
  query Products {
    Products(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const PRODUCT = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        id
        title
        stripeProductID
        ${CATEGORIES}
        ${COLOR}
        ${SIZES}
        productImages {
          id
          caption
          url
          alt
          width
          height
          mimeType
        }
        hoverImage {
          id
          caption
          url
          alt
          filename
          width
          height
          mimeType
        }
        sizeAndFit {
          id
          caption
          url
          alt
          filename
          width
          height
          mimeType
        }
        enableSale
        salePercentage
        soldOut
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        priceJSON
        enablePaywall
        relatedProducts {
          id
          slug
          title
          ${META}
        }
        ${META}
      }
    }
  }
`

export const PRODUCT_PAYWALL = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        paywall {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
      }
    }
  }
`

export const SEARCH_PRODUCTS = `
  query SearchProducts($searchTerm: String!) {
    Products(where: { title: { contains: $searchTerm } }, limit: 100) {
      docs {
        id
        title
        stripeProductID
        ${CATEGORIES}
        ${COLOR}
        ${SIZES}
        productImages {
          id
          caption
          url
          alt
          width
          height
          mimeType
        }
        hoverImage {
          id
          caption
          url
          alt
          filename
          width
          height
          mimeType
        }
        sizeAndFit {
          id
          caption
          url
          alt
          filename
          width
          height
          mimeType
        }
        enableSale
        salePercentage
        soldout
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        priceJSON
        enablePaywall
        relatedProducts {
          id
          slug
          title
          ${META}
        }
        ${META}
      }
    }
  }
`
