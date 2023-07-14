// import "@/styles/globals.css"
import "../../styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AuctionProvider } from "../context/AuctionContext";

export default function App({ Component, pageProps }) {
	return (
		<ThirdwebProvider activeChain="ethereum">
			<AuctionProvider>
				<Component {...pageProps} />
			</AuctionProvider>
		</ThirdwebProvider>
	);
}
