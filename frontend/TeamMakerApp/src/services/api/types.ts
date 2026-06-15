/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: {
    link: string
    type: string
    length: number
    duration: number
    rating: { scheme: string; value: string }
  }
  categories: string[]
}

export interface ApiFeedResponse {
  status: string
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  }
  items: EpisodeItem[]
}

export interface ApiTestOutputResponse {
  name: string
}

export interface ApiPlayer {
  id: number
  name: string
  email?: string
  friendcode?: string
}

export interface ApiLoginResponse {
  token: string
  player: ApiPlayer
}

export interface ApiFriendsResponse {
  player_id: number
  friends: ApiPlayer[]
}

export interface ApiPlayerStats {
  player_id: number
  beachvolleyball_serve: number
  beachvolleyball_receive: number
  beachvolleyball_set: number
  beachvolleyball_hit: number
  beachvolleyball_block: number
  beachvolleyball_effort: number
  beachvolleyball_mentality: number
  beachvolleyball_quick: number
  football_quick: number
  general_quick: number
  last_updated?: string
}

export type ApiPlayerStatsUpdate = Omit<ApiPlayerStats, "player_id" | "last_updated">

export interface ApiPlayerStatsResponse {
  player_id: number
  stats: ApiPlayerStats | null
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
