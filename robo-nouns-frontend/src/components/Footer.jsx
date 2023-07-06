const Footer = () => {
    return (
        <div className="flex bg-nouns-lime">
            <footer className="flex flex-wrap items-center justify-center mt-auto mx-auto mb-0 py-12 font-press text-black text-lg">
                <a
                    className="my-2 mx-3.5 hover:scale-105"
                    href="https://prop.house/nouns/hack-week-developers-developers-developers/5304"
                    target="_blank"
                    rel="noreferrer"
                >
                    Proposal
                </a>
                <a
                    className="my-2 mx-3.5 hover:scale-105"
                    href="https://twitter.com/nounsdao"
                    target="_blank"
                    rel="noreferrer"
                >
                    Twitter
                </a>
                <a
                    className="my-2 mx-3.5 hover:scale-105"
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Etherscan
                </a>
                <a
                    className="my-2 mx-3.5 hover:scale-105"
                    href="https://discourse.nouns.wtf/"
                    target="_self"
                    rel="noreferrer"
                >
                    Forum
                </a>
                <a
                    className="my-2 mx-3.5 hover:scale-105"
                    href="https://github.com/guillermoaviles/robo-nouns/tree/main/robo-nouns"
                    target="_self"
                    rel="noreferrer"
                >
                    GitHub
                </a>
            </footer>
        </div>
    )
}

export default Footer
