import Link from "next/link"
import Image from "next/image"
import { ConnectWallet } from "@thirdweb-dev/react"

export default function Navbar({ className, ...rest }) {
    return (
        <header className="bg-nouns-lime py-12">
            <div className="container mx-auto flex items-center justify-between md:px-32 px-4">
                <Link href="/">
                    <Image
                        src="/noggles.7644bfd0.svg"
                        width="100"
                        height="40"
                        alt="Nouns DAO noggles"
                    />
                </Link>
                <ConnectWallet />
            </div>
        </header>
    )
}
