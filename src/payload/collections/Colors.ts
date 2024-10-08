import type { CollectionConfig } from 'payload/types'

const Colors: CollectionConfig = {
  slug: 'colors',
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

export default Colors
