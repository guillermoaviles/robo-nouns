import React from "react"
import clsx from "clsx"

const faq = [
    {
        title: "Summary",
        description:
            "Nouns VRGDA artwork is in the public domain. Nouns VRGDA are born and trustlessly auctioned via a Gradual Dutch Auction, forever. Settlement of one auction kicks off the next. Artwork is generative and stored directly on-chain (not IPFS). No explicit rules exist for attribute scarcity; all Nouns are equally rare.",
    },
    {
        title: "Variable Rate Gradual Dutch Auctions",
        description:
            "The Nouns Variable Rate Gradual Dutch Auction, forked from Paradigms implementation - https://www.paradigm.xyz/2022/08/vrgda",
    },
    {
        title: "Pseudo-random block traits generation",
        description:
            "At the core of Nouns VRGDA is the concept of on-chain generated NFTs with traits that change every block. This means that, approximately every ~12.1 seconds, a new NFT with distinct attributes will be created. Users can monitor the Nouns's traits as they evolve and purchase it when it matches their preferences. This approach ensures that NFTs are not only rare and valuable but also highly customizable (pseudo-randomly), catering to individual tastes and desires.",
    },

    {
        title: "On-chain pool of last 3 block unsold Nouns",
        description:
            "Nouns VRGDA introduces an on-chain pool of last 3 block unsold Nouns, giving users a second chance to acquire NFTs they may have missed during the 12-second block generation period. The pool maintains a record of the three most recent unsold Nouns. When a new NFT is generated, it overwrites the oldest NFT in the pool, ensuring that users always have access to a diverse selection of previously generated NFTs.",
    },
    {
        title: "On-Chain Artwork",
        description:
            "Nouns VRGDA are stored directly on Goerli and do not utilize pointers to other networks such as IPFS. This is possible because Noun parts are compressed and stored on-chain using a custom run-length encoding (RLE), which is a form of lossless compression. The compressed parts are efficiently converted into a single base64 encoded SVG image on-chain. To accomplish this, each part is decoded into an intermediate format before being converted into a series of SVG rects using batched, on-chain string concatenation. Once the entire SVG has been generated, it is base64 encoded.",
    },
    {
        title: "Nouns VRGDA Noun Traits",
        description:
            "Nouns VRGDA are generated randomly based on Goerli block hashes. There are no 'if' statements or other rules governing Lil Noun trait scarcity, which makes all Lil Nouns equally rare. As of this writing, Lil Nouns are made up of: backgrounds (2), bodies (30)accessories (140), heads (242),glasses (23), You can experiment with off-chain Lil Sandbox Noun generation at the Playground.",
    },
    {
        title: "Noun VRGDA Seeder Contract",
        description:
            "The Noun Seeder contract is used to determine Noun traits during the minting process. The seeder contract can be replaced to allow for future trait generation algorithm upgrades. Currently, Noun traits are determined using pseudo-random number generation:keccak256(abi.encodePacked(blockhash(block.number - 1), nounId)). Trait generation is not truly random. Traits can be predicted when minting a Noun on the pending block. Will work on possible improvement later",
    },

    {
        title: "Conclusion",
        description:
            "In conclusion, Nouns VRGDA is a that combines innovative concepts to create a unique and engaging experience. By incorporating pseudo-random block traits generation, the VRGDA pricing mechanism, and an on-chain pool of last 3 block unsold Nouns, our project offers a fresh and exciting approach for users. We believe that Nouns VRGDA will capture the imagination of the NFT community and pave the way for a new era of digital art and collectibles.",
    },
]

export default function FAQ() {
    return (
        <div className="bg-dark-gray w-full px-6">
            <div className="container bg-dark-gray text-white max-w-screen-lg my-16">
                <div className="flex items-center row">
                    <div className="col-lg-10 offset-lg-1">
                        <div className="text-xl pb-16 ">
                            <h1 className="text-5xl font-semibold mb-8 font-press">
                                WTF is this?
                            </h1>
                            <span className="mt-4">
                                <span className="font-medium">Nouns VRGDA</span>{" "}
                                is project to test out a new minting mechanism
                                for nouns using a Variable Rate Gradual Dutch
                                Auction mechanism instead of english auctions.
                                <br />
                                <br />
                                Introducing three concepts:
                                <li>pseudo-random block traits generation</li>
                                <li>
                                    a variable rate token issuance mechanism
                                </li>
                                <li>
                                    an on-chain pool of saved and unbought NFTs
                                </li>
                            </span>
                        </div>

                        <div
                            className=""
                            id="accordion-collapse"
                            data-accordion="collapse"
                        >
                            {faq.map((item, index) => (
                                <AccordionItem
                                    key={index}
                                    title={item.title}
                                    description={item.description}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AccordionItem({ title, description }) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className=" mb-12 border-none transition-all duration-500 ">
            <h2
                className="text-2xl mb-12 font-press"
                id="accordion-collapse-heading"
            >
                <button
                    type="button"
                    aria-expanded={isOpen}
                    className="w-full text-left flex flex-row justify-between items-center transform hover:scale-105 hover:text-nouns-lime transition-all"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {title}
                    <svg
                        data-accordion-icon
                        className={clsx(
                            "w-6 h-6 shrink-0",
                            isOpen && "rotate-180"
                        )}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </h2>
            {isOpen && (
                <span
                    className="mt-4 text-lg duration-500 transition"
                    id={"accordion-collapse-body"}
                    data-accordion-target="#accordion-collapse-body"
                    aria-expanded="true"
                    aria-controls="accordion-collapse-body"
                >
                    {description}
                </span>
            )}
        </div>
    )
}
