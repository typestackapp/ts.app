export default {
    "admin": {
        "isServer": true,
        "isPublic": false,
        "genClient": true,
        "modules": [
            "@ts.app/core/dist/esm/graphql"
        ],
        "documents": [
            "@ts.app/core/graphql/**/*.{ts,tsx}",
            "@ts.app/core/components/**/*.{ts,tsx}",
            "@ts.app/core/next/app/**/*.{ts,tsx}"
        ]
    }
}