module.exports = {
    mode: "jit",
    purge: ["./src/**/*.{js,ts,jsx,tsx}"],
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    important: true,
    theme: {
        extend: {
            fontFamily: {
                londrina: ["Londrina Solid", "sans-serif"],
                press: ['"Press Start 2P"', "cursive"],
                ptSans: ["PT Sans", "sans-serif"],
            },
            colors: {
                "nouns-blue": "#d5d7e1",
                "nouns-lime": "#70e890",
                "dark-gray": "#252526",
            },
            boxShadow: {
                "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
            },
        },
    },
    plugins: [],
    variants: {},
    plugins: [],
}
