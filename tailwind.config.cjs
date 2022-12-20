/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        fontFamily: {
            display: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', '"Apple Color Emoji"',
                '"Segoe UI Emoji"', '"Segoe UI Symbol"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
            body: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', '"Apple Color Emoji"',
                '"Segoe UI Emoji"', '"Segoe UI Symbol"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
            mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
        },
        extend: {
            colors: {
                primary: {
                    lightest: '#aa5555',
                    light: '#993333',
                    DEFAULT: '#990000',
                    dark: '#660000'
                }
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite'
            },
            keyframes: {
                spin: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                }
            },
            theme: {
                extend: {
                    typography: (theme) => ({
                        DEFAULT: {
                            css: {
                                color: '#FF922C'
                            }
                        }
                    })
                }
            }
        }
    },
    plugins: [
        require('@tailwindcss/typography')
    ]
}
