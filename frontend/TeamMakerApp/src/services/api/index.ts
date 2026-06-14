/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApisauceInstance, create } from "apisauce"

import Config from "@/config"

import { getGeneralApiProblem } from "./apiProblem"
import type { GeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiTestOutputResponse } from "./types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async getTestOutput(): Promise<{ kind: "ok"; name: string } | GeneralApiProblem> {
    const response = await this.apisauce.get<ApiTestOutputResponse>("/")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    if (typeof response.data?.name !== "string") {
      return { kind: "bad-data" }
    }

    return { kind: "ok", name: response.data.name }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
