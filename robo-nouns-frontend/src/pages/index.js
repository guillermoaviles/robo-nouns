import Head from "next/head"
import Image from "next/image"
import { Inter } from "next/font/google"
import Navbar from "../components/Navbar"
import Auction from "@/components/Auction"
import Footer from "@/components/Footer"
import FAQ from "@/components/FAQ"
import PrevNFTs from "@/components/PrevNFTs"

export default function Home() {
    return (
        <>
            <Head>
                <title>Robo Nouns</title>
                <meta name="description" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <Navbar />
            <main className="App_wrapper bg-nouns-lime">
                <Auction />
                <PrevNFTs />
                <FAQ />
            </main>
            <Footer />
        </>
    )
}
