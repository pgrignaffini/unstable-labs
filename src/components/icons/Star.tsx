import React from 'react'

type Props = {
    width?: number
    height?: number
}

function Star({ width, height }: Props): JSX.Element {
    return (
        <svg className="fill-amber-400" width={width || "45"} height={height || "45"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.3333 4H12.3333V5H11.3333V4Z" />
            <path d="M12.3333 4H11.3333V5H12.3333V4Z" />
            <path d="M4.33333 10H3.33333V11H4.33333V10Z" />
            <path d="M19.3333 10H20.3333V11H19.3333V10Z" />
            <path d="M7.33333 12H6.33333V13H7.33333V12Z" />
            <path d="M16.3333 12H17.3333V13H16.3333V12Z" />
            <path d="M10.3333 17H9.33333V18H10.3333V17Z" />
            <path d="M13.3333 17H14.3333V18H13.3333V17Z" />
            <path d="M11.3333 5H10.3333V7H11.3333V5Z" />
            <path d="M13.3333 5H12.3333V7H13.3333V5Z" />
            <path d="M14.3333 7H13.3333V9H14.3333V7Z" />
            <path d="M10.3333 7H9.33333V9H10.3333V7Z" />
            <path d="M9.33333 10V9H4.33333V10H9.33333Z" />
            <path d="M14.3333 9V10H19.3333V9H14.3333Z" />
            <path d="M17.3333 11V12H19.3333V11H17.3333Z" />
            <path d="M16.3333 13H15.3333V15H16.3333V13Z" />
            <path d="M8.33333 13H7.33333V15H8.33333V13Z" />
            <path d="M16.3333 17H17.3333V15H16.3333V17Z" />
            <path d="M17.3333 19H16.3333V20H18.3333V17H17.3333V19Z" />
            <path d="M16.3333 19V18H14.3333V19H16.3333Z" />
            <path d="M13.3333 17V16H10.3333V17H13.3333Z" />
            <path d="M7.33333 18V19H9.33333V18H7.33333Z" />
            <path d="M7.33333 19H6.33333V17H5.33333V20H7.33333V19Z" />
            <path d="M6.33333 17H7.33333V15H6.33333V17Z" />
            <path d="M6.33333 12V11H4.33333V12H6.33333Z" />
        </svg>

    )
}

export default Star