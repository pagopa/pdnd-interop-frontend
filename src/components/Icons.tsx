import React from 'react'

// type IconState = 'default' | 'active'

// type IconProps = {
//   name: string
//   state: IconState
// }

// type IconObject = { [key: string]: React.FunctionComponent<IconState> }

// const Notification = ({ state }: IconState) => {
//   const strokeColor = '#0073E6'
//   const fillColor = 'transparent'

//   return (
//     <React.Fragment>
//       <path
//         d="M6.91707 7.00212C7.16698 3.83965 10.4129 3.01649 12.0938 3.00023C14.3698 2.9782 16.7351 4.56195 17.1813 7.00212C17.2884 7.58777 18.1631 13.737 19.0557 14.7131C19.2788 14.9571 20.4837 15.9332 20.7515 16.6164C20.9716 17.1781 21.1978 18.9035 20.7069 18.9102C15.0989 18.9871 3.76639 19.0664 3.30227 18.9102C2.72212 18.715 3.12376 17.2021 3.30227 16.7628C3.48078 16.3236 4.81959 15.1035 5.04273 14.7131C5.26586 14.3227 6.60468 10.9552 6.91707 7.00212Z"
//         fill={fillColor}
//         stroke={strokeColor}
//       />
//       <path
//         d="M12 21C10.72 21 10 19.8 10 19H14C14 19.8 13.28 21 12 21Z"
//         fill={fillColor}
//         stroke={strokeColor}
//       />
//     </React.Fragment>
//   )
// }

// export function Icons({ name, state }: IconProps) {
//   const ICONS: IconObject = {
//     notification: Notification,
//   }

//   const Icon = ICONS[name]

//   return <Icon state={state} />
// }
