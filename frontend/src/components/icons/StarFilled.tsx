import React from 'react'

type Props = {
    width?: number
    height?: number
}

function StarFilled({ width, height }: Props): JSX.Element {
    return (
        <svg className="fill-amber-400" width={width || "45"} height={height || "45"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6667 4H12.6667V5H11.6667V4Z" />
            <path d="M12.6667 4H11.6667V5H12.6667V4Z" />
            <path d="M4.66667 10H3.66667V11H4.66667V10Z" />
            <path d="M19.6667 10H20.6667V11H19.6667V10Z" />
            <path d="M7.66667 12H6.66667V13H7.66667V12Z" />
            <path d="M16.6667 12H17.6667V13H16.6667V12Z" />
            <path d="M10.6667 17H9.66667V18H10.6667V17Z" />
            <path d="M13.6667 17H14.6667V18H13.6667V17Z" />
            <path d="M11.6667 5H10.6667V7H11.6667V5Z" />
            <path d="M13.6667 5H12.6667V7H13.6667V5Z" />
            <path d="M14.6667 7H13.6667V9H14.6667V7Z" />
            <path d="M10.6667 7H9.66667V9H10.6667V7Z" />
            <path d="M9.66667 10V9H4.66667V10H9.66667Z" />
            <path d="M14.6667 9V10H19.6667V9H14.6667Z" />
            <path d="M17.6667 11V12H19.6667V11H17.6667Z" />
            <path d="M16.6667 13H15.6667V15H16.6667V13Z" />
            <path d="M8.66667 13H7.66667V15H8.66667V13Z" />
            <path d="M16.6667 17H17.6667V15H16.6667V17Z" />
            <path d="M17.6667 19H16.6667V20H18.6667V17H17.6667V19Z" />
            <path d="M16.6667 19V18H14.6667V19H16.6667Z" />
            <path d="M13.6667 17V16H10.6667V17H13.6667Z" />
            <path d="M7.66667 18V19H9.66667V18H7.66667Z" />
            <path d="M7.66667 19H6.66667V17H5.66667V20H7.66667V19Z" />
            <path d="M6.66667 17H7.66667V15H6.66667V17Z" />
            <path d="M6.66667 12V11H4.66667V12H6.66667Z" />
            <path d="M11.6667 7V5H12.6667V7H13.6667V9H14.6667V10H19.6667V11H17.6667V12H16.6667V13H15.6667V15H16.6667V17H17.6667V19H16.6667V18H14.6667V17H13.6667V16H10.6667V17H9.66667V18H7.66667V19H6.66667V17H7.66667V15H8.66667V13H7.66667V12H6.66667V11H4.66667V10H9.66667V9H10.6667V7H11.6667Z" />
        </svg>


    )
}

export default StarFilled