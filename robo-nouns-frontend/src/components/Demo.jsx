// components/Demo.js
import Image from "next/image"
import React from "react"

const Demo = ({ date, nftCount, price, priceDropTime }) => {
    return (
        <div className="flex flex-col items-center justify-between p-8 md:flex-row">
            <Image
                src="/big-image.png"
                alt="Big Image"
                className="mb-4 w-full md:mb-0 md:h-auto md:w-1/2"
                width={500}
                height={500}
            />
            <div className="md:w-1/2 md:pl-8">
                <h3>Date: {date}</h3>
                <h3>NFT Count: {nftCount}</h3>
                <h3>Price: {price}</h3>
                <h3>Price Drop Time: {priceDropTime}</h3>
                {/* Counter Bar Component */}
                <button className="mt-4 bg-blue-600 px-6 py-2 text-white">
                    Buy
                </button>
            </div>
        </div>
    )
}

export default Demo
