import React from 'react'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const MediumImpactHero: React.FC<Page['hero']> = props => {
  const { richText, media, links } = props
  const firstLink = links?.[0]?.link

  // MediumImpact is being used for landing page 
  return (
    <div className={classes.heroWrapper}>
      <div className={classes.background}>
        {/* <RichText className={classes.richText} content={richText} /> */}
        {/* {Array.isArray(links) && (
          <ul className={classes.links}>
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink className={classes.link} {...link} />
                </li>
              )
            })}
          </ul>
        )} */}
      </div>
      <div className={classes.media}>
        {typeof media === 'object' && 
          <div className={classes.mediaLinkWrap}>
            <Media className={classes.media} resource={media} />
            <CMSLink className={classes.mediaLink} {...firstLink} />
          </div>
        }
      </div>
    </div>
  )
}
