import { AuthUrlOptions, CallbackOptions, Client, ClientOptions, ClientSession, GetTokenOptions } from "@ts.app/core/models/user/app/oauth/client.js"
import moment from "moment"

export type DropboxTokenResponse = {
    access_token: string
    refresh_token?: string
    token_type: string
    scope: string
    account_id: string
    team_id: string
    expires_in: number
    uid: string
    id_token: string
    error?: string
    error_description?: string
}

export default class DropboxClient extends Client {
    options: ClientOptions
    session: ClientSession

    constructor(options: ClientOptions) {
        super()
        this.options = options
        this.session = {
            data: undefined,
            error: undefined,
        }
    }

    async callback(options: CallbackOptions): Promise<ClientSession> {
        const url = `https://api.dropboxapi.com/oauth2/token`
        let response: ClientSession = {
            data: undefined,
            error: undefined,
        }

        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                code: options.code,
                grant_type: "authorization_code",
                redirect_uri: options.app.callback_url,
                client_id: options.app.client_id,
                client_secret: options.app.client_secret,
            }).toString()
        })
        .then(res => res.json() as Promise<DropboxTokenResponse>)
        .then(res => {
            if(res.error){
                response.error = {
                    code: "oauth-callback-fetch-error",
                    msg: `${res.error}: ${res.error_description}`
                }
                return response
            }

            if(res.refresh_token == undefined) throw new Error("No refresh token found")

            response.data = {
                refresh: {
                    tk: res.refresh_token,
                    exp: moment.utc().add(res.expires_in, "seconds").toISOString()
                },
                access: {
                    tk: res.access_token,
                    exp: moment.utc().add(res.expires_in, "seconds").toISOString()
                },
            }
            return response
        })
        .catch(error => {
            response.error = {
                code: "oauth-callback-fetch-error",
                msg: `${error}`
            }
            return response
        })
    }

    getAuthUrl(options: AuthUrlOptions): string {
        const url = `https://www.dropbox.com/oauth2/authorize`
        const params = new URLSearchParams({
            client_id: this.options.client_id,
            response_type: "code",
            redirect_uri: options.redirect_url,
            state: options.state,
            token_access_type: "offline",
        })
        return `${url}?${params.toString()}`
    }

    // returns Authorization header for bearer token
    async getToken(options: GetTokenOptions) {
        const url = `https://api.dropboxapi.com/oauth2/token`

        const refresh_token = options.token.refresh?.tk

        if(!refresh_token) throw new Error("No refresh token found")

        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token,
                client_id: options.app.client_id,
                client_secret: options.app.client_secret,
            }).toString()
        })
        .then(res => res.json() as Promise<DropboxTokenResponse>)
        .then(res => {
            if(res.error) {
                throw new Error(`${res.error}: ${res.error_description}`)
            }
            this.session.data = {
                refresh: {
                    tk: res.refresh_token || refresh_token,
                    exp: moment.utc().add(res.expires_in, "seconds").toISOString()
                },
                access: {
                    tk: res.access_token,
                    exp: moment.utc().add(res.expires_in, "seconds").toISOString()
                },
            }
            return this.session.data
        })
        .catch(error => {
            throw new Error(`${error}`)
        })
    }

    isTokenPresent() {
        return false as any
        // return this.session?.data != undefined
    }

    isAccessTokenValid() {
        return false as any
        // if(!this.session?.data) throw new Error("No session set at isAccessTokenValid")
        // return moment(this.session.data.at_exp).isAfter(moment.utc())
    }

    isRefreshTokenValid() {
        return false as any
        // if(!this.session?.data) throw new Error("No session set at isRefreshTokenValid")
        // return moment(this.session.data.rt_exp).isAfter(moment.utc())
    }

}