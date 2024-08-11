'use client'

import React from 'react'
import Link from 'next/link'
import classes from './index.module.scss'

type TopBannerProps = {
  text?: string
  link?: string
}

export const TopBanner: React.FC<TopBannerProps> = ({ text, link }) => {
  if (!text) return null

  return (
    <div className={classes.topBanner}>
      {link ? (
        <Link href={link} className={classes.link}>
          {text}
        </Link>
      ) : (
        <span>{text}</span>
      )}
    </div>
  )
}
