import { AccessConfigInput } from "@ts.app/core";

export default  {
    "Test": {
        "getPing": {
            "info": [ "everyone is able to ping server" ]
        },
        "DevApp": {
            "info": [ "show component based app in admin panel" ],
            "admin": { "title": "Dev App", "app": "@ts.app/dev/next/app/test/page.js" },
            "permission": "Read"
        },
        "DevIframe1": {
            "info": [ "show iframe based app in admin panel" ],
            "admin": { "title": "Dev Iframe 1", "iframe": ":7443/admin" },
            "permission": "Read"
        },
        "DevIframe2": {
            "info": [ "show iframe based app in admin panel" ],
            "admin": { "title": "Dev Iframe 2", "iframe": "https://localhost:7443/admin" },
            "permission": "Read"
        },
        "DevIframe3": {
            "info": [ "show iframe based app in admin panel" ],
            "admin": { "title": "Dev Iframe 3", "iframe": "/admin" },
            "permission": "Read"
        }
    }
} satisfies AccessConfigInput