import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
import image from '@astrojs/image'

// https://astro.build/config
import solidJs from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind({
        config: {
            applyBaseStyles: false
        }
    }), image(), solidJs()]
})
