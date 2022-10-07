import React from 'react'

type Props = {
    width?: number
    height?: number
}

function Rocket({ width, height }: Props): JSX.Element {
    return (
        <svg className="fill-red-600" width={width || "45"} height={height || "45"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 4V5H11V4H13Z" />
            <path d="M10 6V5H11V6H10Z" />
            <path d="M9 7V6H10V7H9Z" />
            <path fillRule="evenodd" clipRule="evenodd" d="M15 7V15H9V7H8V12H7V13H6V14H5V17H6V18H7V17H8V16H9V18H10V19H11V20H13V19H14V18H15V16H16V17H17V18H18V17H19V14H18V13H17V12H16V7H15ZM17 13V14H18V17H17V16H16V13H17ZM14 18H13V19H11V18H10V16H14V18ZM8 16H7V17H6V14H7V13H8V16Z" />
            <path d="M14 6H15V7H14V6Z" />
            <path d="M14 6V5H13V6H14Z" />
            <path d="M11 8V10H10V8H11Z" />
            <path d="M13 8H11V7H13V8Z" />
            <path d="M13 10V8H14V10H13Z" />
            <path d="M13 10H11V11H13V10Z" />
        </svg>
    )
}

export default Rocket