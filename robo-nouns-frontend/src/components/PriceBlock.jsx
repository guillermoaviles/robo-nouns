import React from "react"

const PriceBlocks = ({ price }) => {
    const getBlockStyle = (minValue, maxValue) => {
        const baseStyle = "md:w-[30px] md:h-[30px] w-[21px] h-[21px]"
        const activeStyle = "border-2 border-black"
        const inRange = price >= minValue && price < maxValue

        return inRange ? `${baseStyle} ${activeStyle}` : baseStyle
    }

    return (
        <div className="flex flex-row items-center justify-between space-x-[4px] mt-[12px]">
            <div className={`bg-[#2B83F6] ${getBlockStyle(0, 0.1)}`}></div>
            <div className={`bg-[#2B83F6] ${getBlockStyle(0.1, 0.17)}`}></div>
            <div className={`bg-[#5D9DC3] ${getBlockStyle(0.17, 0.24)}`}></div>
            <div className={`bg-[#8FB78E] ${getBlockStyle(0.24, 0.33)}`}></div>
            <div className={`bg-[#C6D254] ${getBlockStyle(0.33, 0.41)}`}></div>
            <div className={`bg-[#FFEF17] ${getBlockStyle(0.41, 0.48)}`}></div>
            <div className={`bg-[#FFEF17] ${getBlockStyle(0.48, 0.55)}`}></div>
            <div className={`bg-[#FFEF17] ${getBlockStyle(0.55, 0.62)}`}></div>
            <div className={`bg-[#FFCB37] ${getBlockStyle(0.62, 0.69)}`}></div>
            <div className={`bg-[#FFB946] ${getBlockStyle(0.69, 0.76)}`}></div>
            <div className={`bg-[#FF9564] ${getBlockStyle(0.76, 0.83)}`}></div>
            <div className={`bg-[#FF638D] ${getBlockStyle(0.83, 0.91)}`}></div>
            <div className={`bg-[#FF638D] ${getBlockStyle(0.91, 1.01)}`}></div>
        </div>
    )
}

export default PriceBlocks
