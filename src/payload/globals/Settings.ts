import type { GlobalConfig } from 'payload/types'

export const Settings: GlobalConfig = {
  slug: 'settings',
  typescript: {
    interface: 'Settings',
  },
  graphQL: {
    name: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'productsPage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Products page',
    },
    {
      name: 'topBannerText',
      type: 'text',
      label: 'Top Banner Text',
    },
    {
      name: 'topBannerPage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Top Banner',
    },
  ],
}
