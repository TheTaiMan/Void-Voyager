import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8' // or 'istanbul'
        },
    },
})

// npx vitest run --coverage
