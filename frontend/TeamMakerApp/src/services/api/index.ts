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
import type {
  ApiConfig,
  ApiFriendsResponse,
  ApiLoginResponse,
  ApiPlayer,
  ApiPlayerStats,
  ApiPlayerStatsResponse,
  ApiPlayerStatsUpdate,
  ApiRecentGame,
  ApiRecentGamesResponse,
  ApiTestOutputResponse,
} from "./types"

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

  async login(
    email: string,
    password: string,
  ): Promise<{ kind: "ok"; token: string; player: ApiPlayer } | GeneralApiProblem> {
    const response = await this.apisauce.post<ApiLoginResponse>("/login", { email, password })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    if (
      typeof response.data?.token !== "string" ||
      typeof response.data.player?.id !== "number" ||
      typeof response.data.player.name !== "string"
    ) {
      return { kind: "bad-data" }
    }

    return { kind: "ok", token: response.data.token, player: response.data.player }
  }

  async getFriends(
    playerId: number,
  ): Promise<{ kind: "ok"; friends: ApiPlayer[] } | GeneralApiProblem> {
    const response = await this.apisauce.get<ApiFriendsResponse>(`/get_friends/${playerId}`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    if (!Array.isArray(response.data?.friends)) {
      return { kind: "bad-data" }
    }

    return { kind: "ok", friends: response.data.friends }
  }

  async getPlayerStats(
    playerId: number,
  ): Promise<{ kind: "ok"; stats: ApiPlayerStats | null } | GeneralApiProblem> {
    const response = await this.apisauce.get<ApiPlayerStatsResponse>(`/playerstats/${playerId}`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    if (!response.data || !("stats" in response.data)) {
      return { kind: "bad-data" }
    }

    return { kind: "ok", stats: response.data.stats }
  }

  async updatePlayerStats(
    playerId: number,
    stats: ApiPlayerStatsUpdate,
  ): Promise<{ kind: "ok"; stats: ApiPlayerStats } | GeneralApiProblem> {
    const response = await this.apisauce.put<ApiPlayerStatsResponse>(
      `/playerstats/${playerId}`,
      stats,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    if (!response.data?.stats) {
      return { kind: "bad-data" }
    }

    return { kind: "ok", stats: response.data.stats }
  }

  async getRecentGames(
    playerId: number,
    limit = 10,
  ): Promise<{ kind: "ok"; games: ApiRecentGame[] } | GeneralApiProblem> {
    const response = await this.apisauce.get<ApiRecentGamesResponse>(
      `/players/${playerId}/recent-games`,
      { limit },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    if (!Array.isArray(response.data?.games)) {
      return { kind: "bad-data" }
    }

    return { kind: "ok", games: response.data.games }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
