/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                mais: {
                    blue: '#0c2444',
                    orange: '#f58f2a',
                    red: '#f15424',
                    navy: '#14244c',
                    green: '#22c55e', // Emerald 500
                    yellow: '#eab308', // Yellow 500
                },
            },
        },
    },
    plugins: [],
};
