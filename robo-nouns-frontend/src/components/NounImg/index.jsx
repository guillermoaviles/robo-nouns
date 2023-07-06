import Image from "next/image";
import { useAuction } from "../../context/AuctionContext";
import loadingNoun from "../../assets/loading-skull-noun.gif";

export default function NounImg({ nounNFTMeta }) {
  return (
    <div className="w-full lg:w-1/2">
      <div className="relative aspect-w-1 aspect-h-1">
        <div className="absolute inset-0">
          <Image
            src={nounNFTMeta[0]?.svg ? `data:image/svg+xml;base64,${nounNFTMeta[0]?.svg}` : loadingNoun}
            alt="Noun Image"
            className="object-cover w-full h-full"
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
}
