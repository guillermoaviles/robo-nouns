import { useContract } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import Image from "next/image"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import loadingNoun from "../../assets/loading-skull-noun.gif"
import { useAuction } from "@/context/AuctionContext"

export default function BuyNow({ nft, currMintPrice }) {
    const { lastTokenBlock, auctionContractAddress } = useAuction()
    const [showModal, setShowModal] = useState(false)
    const [transactionStatus, setTransactionStatus] = useState("")
    const [transactionHash, setTransactionHash] = useState("")

    const { contract } = useContract(auctionContractAddress)

    const call = async () => {
        try {
            if (!contract) {
                throw new Error("Contract is undefined")
            }
            setShowModal(true)
            setTransactionStatus("Pending")
            const args = [ethers.BigNumber.from(nft.blockNumber).toString()]
            const currMintPriceBigNumber =
                ethers.utils.parseEther(currMintPrice)
            const tx = await contract.call("buyNow", args, {
                value: currMintPriceBigNumber,
                gasLimit: 1000000,
            })
            const receipt = tx.receipt
            console.log("receipt", receipt)
            setTransactionStatus("Success")
        } catch (err) {
            console.error("contract call failure", err)
            setTransactionStatus("Failed")
            setShowModal(true)
        }
    }

    return (
        <div className="input-group">
            {lastTokenBlock >= nft?.blockNumber ? (
                <svg
                    className="cursor-pointer overflow-visible mx-auto"
                    id="svg"
                    width="160"
                    height="60"
                    viewBox="0, 0, 400,150"
                >
                    <a
                        className={
                            "BuyBtn btn-primary hover:text-nouns-lime hover:scale-105"
                        }
                        onClick={null}
                    >
                        <g id="svgg">
                            <path
                                id="path0"
                                d="M50.000 8.333 L 50.000 16.667 41.667 16.667 L 33.333 16.667 33.333 25.000 L 33.333 33.333 25.000 33.333 L 16.667 33.333 16.667 41.667 L 16.667 50.000 8.333 50.000 L 0.000 50.000 0.000 75.000 L 0.000 100.000 8.333 100.000 L 16.667 100.000 16.667 108.333 L 16.667 116.667 25.000 116.667 L 33.333 116.667 33.333 125.000 L 33.333 133.333 41.667 133.333 L 50.000 133.333 50.000 141.667 L 50.000 150.000 200.000 150.000 L 350.000 150.000 350.000 141.667 L 350.000 133.333 358.333 133.333 L 366.667 133.333 366.667 125.000 L 366.667 116.667 375.000 116.667 L 383.333 116.667 383.333 108.333 L 383.333 100.000 391.667 100.000 L 400.000 100.000 400.000 75.000 L 400.000 50.000 391.667 50.000 L 383.333 50.000 383.333 41.667 L 383.333 33.333 375.000 33.333 L 366.667 33.333 366.667 25.000 L 366.667 16.667 358.333 16.667 L 350.000 16.667 350.000 8.333 L 350.000 0.000 200.000 0.000 L 50.000 0.000 50.000 8.333 "
                                stroke="none"
                                fill="#000000"
                                fillRule="evenodd"
                            ></path>
                            <path
                                id="path1"
                                d=""
                                stroke="none"
                                fill="#080404"
                                fillRule="evenodd"
                            ></path>
                            <path
                                id="path2"
                                d=""
                                stroke="none"
                                fill="#080404"
                                fillRule="evenodd"
                            ></path>
                            <path
                                id="path3"
                                d=""
                                stroke="none"
                                fill="#080404"
                                fillRule="evenodd"
                            ></path>
                            <path
                                id="path4"
                                d=""
                                stroke="none"
                                fill="#080404"
                                fillRule="evenodd"
                            ></path>
                            <text
                                className="font-press text-4xl"
                                x="205"
                                y="78"
                                fill="#FF638D"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                Ended
                            </text>
                        </g>
                    </a>
                </svg>
            ) : (
                <svg
                    className="cursor-pointer overflow-visible mx-auto"
                    id="svg"
                    width="160"
                    height="60"
                    viewBox="0, 0, 400,150"
                >
                    <a
                        className={
                            "BuyBtn btn-primary hover:text-nouns-lime hover:scale-105"
                        }
                        onClick={call}
                    >
                        <g id="svgg">
                            <path
                                id="path0"
                                d="M50.000 8.333 L 50.000 16.667 41.667 16.667 L 33.333 16.667 33.333 25.000 L 33.333 33.333 25.000 33.333 L 16.667 33.333 16.667 41.667 L 16.667 50.000 8.333 50.000 L 0.000 50.000 0.000 75.000 L 0.000 100.000 8.333 100.000 L 16.667 100.000 16.667 108.333 L 16.667 116.667 25.000 116.667 L 33.333 116.667 33.333 125.000 L 33.333 133.333 41.667 133.333 L 50.000 133.333 50.000 141.667 L 50.000 150.000 200.000 150.000 L 350.000 150.000 350.000 141.667 L 350.000 133.333 358.333 133.333 L 366.667 133.333 366.667 125.000 L 366.667 116.667 375.000 116.667 L 383.333 116.667 383.333 108.333 L 383.333 100.000 391.667 100.000 L 400.000 100.000 400.000 75.000 L 400.000 50.000 391.667 50.000 L 383.333 50.000 383.333 41.667 L 383.333 33.333 375.000 33.333 L 366.667 33.333 366.667 25.000 L 366.667 16.667 358.333 16.667 L 350.000 16.667 350.000 8.333 L 350.000 0.000 200.000 0.000 L 50.000 0.000 50.000 8.333 "
                                stroke="none"
                                fill="#000000"
                                fillRule="evenodd"
                            ></path>
                            <path
                                id="path1"
                                d=""
                                stroke="none"
                                fill="#080404"
                                fillRule="evenodd"
                            ></path>
                            <path
                                id="path2"
                                d=""
                                stroke="none"
                                fill="#080404"
                                fillRule="evenodd"
                            ></path>
                            <path
                                id="path3"
                                d=""
                                stroke="none"
                                fill="#080404"
                                fillRule="evenodd"
                            ></path>
                            <path
                                id="path4"
                                d=""
                                stroke="none"
                                fill="#080404"
                                fillRule="evenodd"
                            ></path>
                            <text
                                className="font-press text-4xl"
                                x="205"
                                y="78"
                                fill="#FFFFFF"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                Buy Now
                            </text>
                        </g>
                    </a>
                </svg>
            )}

            <Transition.Root show={showModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={setShowModal}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            {transactionStatus ===
                                                "Pending" && (
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center bg-[#70e890] sm:mx-0 sm:h-14 sm:w-14">
                                                    <Image
                                                        src={loadingNoun}
                                                        alt={`Waiting Confirmation`}
                                                        width={56}
                                                        height={25}
                                                    />
                                                </div>
                                            )}
                                            {transactionStatus ===
                                                "Success" && (
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center bg-[#70e890] sm:mx-0 sm:h-14 sm:w-14">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="w-10 h-10"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                            {transactionStatus === "Failed" && (
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center bg-red-600 sm:mx-0 sm:h-14 sm:w-14">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="w-10 h-10"
                                                    >
                                                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-base font-semibold leading-6 text-gray-900"
                                                >
                                                    Transaction Status:{" "}
                                                    {transactionStatus}
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    {transactionStatus ===
                                                        "Pending" && (
                                                        <p className="text-sm text-gray-500">
                                                            Waiting for
                                                            confirmation...
                                                        </p>
                                                    )}
                                                    {transactionStatus ===
                                                        "Failed" && (
                                                        <p className="text-sm text-gray-500">
                                                            Transaction failed.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>
                                        <div>
                                            {transactionStatus ===
                                                "Success" && (
                                                <a
                                                    href={`https://etherscan.io/tx/${transactionHash}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 mr-28 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    >
                                                        View on Etherscan
                                                    </button>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    )
}
