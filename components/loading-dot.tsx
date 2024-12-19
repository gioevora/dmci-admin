import React from 'react'

const LoadingDot = () => {
    return (
        <div className="flex flex-row gap-2 items-center justify-center h-full">
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
    )
}

export default LoadingDot