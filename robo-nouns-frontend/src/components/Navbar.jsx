import Link from "next/link"
import Image from "next/image"
import { ConnectWallet } from "@thirdweb-dev/react"

export default function Navbar({ className, ...rest }) {
    return (
        <header className="bg-nouns-lime pt-6 md:py-12">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 h-full">
                <div className="flex items-end justify-center md:justify-start flex-grow">
                    <Link href="https://nouns.wtf/">
                        <Image
                            src="/noggles.7644bfd0.svg"
                            width="100"
                            height="40"
                            alt="Nouns DAO noggles"
                            className="mt-1 md:mt-2 mr-4 md:mr-14" 
                        />
                    </Link>
                    <h1 className="font-press text-dark-gray text-2xl md:text-5xl -mb-1">
                        RoboNouns
                    </h1>
                </div>

                <ConnectWallet className="connectWallet mt-8 md:-mt-4" theme="light" />
            </div>
        </header>
    )
}
