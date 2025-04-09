export default {
    "system": {
        "isServer": true,
        "isPublic": true,
        "genClient": true,
        "modules": [
            "@ts.app/core/dist/esm/graphql/common",
            "@ts.app/dev/dist/esm/graphql/test"
        ],
        "documents": [
            "@ts.app/dev/graphql/**/*.{ts,tsx}",
            "@ts.app/dev/components/**/*.{ts,tsx}",
            "@ts.app/dev/next/app/**/*.{ts,tsx}"
        ]
    }
}