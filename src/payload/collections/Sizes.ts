import type { CollectionConfig } from 'payload/types'

const Sizes: CollectionConfig = {
  slug: 'sizes',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}

export default Sizes
