interface IRouterProps {
  [key: string]: string
}

export default class RouterService {
  public readonly baseUrl: string
  private static _instance: RouterService

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || `${location.protocol}//${location.host}`
  }

  static get instance(): RouterService {
    if (!RouterService._instance) {
      RouterService._instance = new RouterService()
    }

    return RouterService._instance
  }

  public get(path: string, args: IRouterProps): string {
    return this._generateUrl(this.baseUrl, path, args)
  }

  private _generateUrl(url, path, args): string {
    let baseUrl = `${url}${path}?`

    for (let key in args) {
      if (args.hasOwnProperty(key)) {
        if (baseUrl.indexOf(`{${key}}`) !== -1) {
          baseUrl = baseUrl.replace(`{${key}}`, args[key])
        } else {
          baseUrl = baseUrl + `${key}=${args[key]}&`
        }
      }
    }

    return baseUrl.slice(0, -1)
  }
}
