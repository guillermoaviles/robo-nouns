import Link from "next/link"
import Image from "next/image"
import { ConnectWallet } from "@thirdweb-dev/react"

export default function Navbar({ className, ...rest }) {
    return (
        <header className="bg-nouns-lime pt-2 md:pt-6 md:py-12">
            <div className="container mx-auto flex flex-row md:items-start justify-between md:px-8 h-full">
                <div className="flex justify-center md:justify-start flex-grow items-center md:items-end">
                    <Link href="https://nouns.wtf/">
                        <Image
                            src="/noggles.7644bfd0.svg"
                            width="100"
                            height="40"
                            alt="Nouns DAO noggles"
                            className="mt-1 md:mt-2 mr-4 md:mr-4 lg:mr-14"
                        />
                    </Link>
                    <h1 className="ml-2 mt-1 font-press text-dark-gray text-md md:text-3xl -mb-1">
                        Robo Nouns
                    </h1>
                </div>

                <ConnectWallet className="connectWallet" theme="light" />
            </div>
        </header>
    )
}
