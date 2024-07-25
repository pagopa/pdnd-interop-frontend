import React from 'react'
import useResolveError from '@/hooks/useResolveError'
import type { FallbackProps } from 'react-error-boundary'
import { Stack, Typography } from '@mui/material'

const ErrorPage: React.FC<FallbackProps> = (props) => {
  const { title, description, content } = useResolveError(props)

  return (
    <Stack justifyContent="center" alignItems="center" spacing={4} sx={{ height: '100%', py: 16 }}>
      <Stack
        spacing={1}
        sx={{ alignItems: 'center', textAlign: 'center', maxWidth: 560, mx: 'auto' }}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id="a" maskUnits="userSpaceOnUse" x="7" y="0" width="46" height="60">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.583 15.681c.004-.016.009-.033.015-.049a1.06 1.06 0 0 1 .186-.29l13.929-15c.004-.006.015-.013.015-.013a.933.933 0 0 1 .068-.054c.073-.065.154-.12.242-.163a.98.98 0 0 1 .107-.04.999.999 0 0 1 .293-.059c.01 0 .02-.003.029-.006A.11.11 0 0 1 22.5 0h28.929C52.02 0 52.5.48 52.5 1.071V58.93c0 .591-.48 1.071-1.071 1.071H8.57C7.98 60 7.5 59.52 7.5 58.929V16.07c0-.01.003-.02.006-.03a.1.1 0 0 0 .006-.03c.006-.1.026-.198.06-.293l.01-.037ZM21.429 15V3.8L11.029 15h10.4ZM9.643 17.143H22.5c.592 0 1.071-.48 1.071-1.072V2.143h26.786v55.714H9.643V17.143Zm15.899 10.191a1.036 1.036 0 0 1-.195.246c-.007.006-.011.013-.016.02-.005.008-.01.016-.018.022l-5.358 4.286a1.072 1.072 0 0 1-1.339-1.673l2.972-2.378h-3.374a1.071 1.071 0 0 1 0-2.143h3.374l-2.972-2.378a1.071 1.071 0 0 1 1.34-1.674l5.357 4.286a.086.086 0 0 1 .018.022c.005.007.01.015.016.02.077.073.143.155.195.247.026.034.05.07.071.107.135.279.135.604 0 .883a1.021 1.021 0 0 1-.071.107Zm16.244-1.62h-3.374l2.972-2.377a1.071 1.071 0 1 0-1.34-1.674l-5.356 4.286c-.009.006-.014.014-.02.022-.004.008-.008.015-.015.02a1.034 1.034 0 0 0-.195.246c-.026.034-.05.07-.071.107a1.017 1.017 0 0 0 0 .883c.021.037.045.073.071.107.052.091.118.174.195.246.007.006.011.013.016.02.005.008.01.016.019.022l5.357 4.286a1.072 1.072 0 0 0 1.339-1.673l-2.972-2.378h3.374a1.071 1.071 0 0 0 0-2.143Zm-20.727 15.67A9.605 9.605 0 0 1 30 35.357a9.605 9.605 0 0 1 8.941 6.027 1.073 1.073 0 1 1-1.986.803 7.501 7.501 0 0 0-13.91 0 1.071 1.071 0 0 1-1.986-.803Z"
              fill="#fff"
            />
          </mask>
          <g mask="url(#a)">
            <path fill="#00C5CA" d="M-1.99-7.137h68v70h-68z" />
          </g>
        </svg>
        <Typography variant="h3" component="h1">
          {title}
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </Stack>
      {content}
    </Stack>
  )
}

export default ErrorPage
