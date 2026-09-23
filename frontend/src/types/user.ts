export interface UserResponse {
  id: number;
  username: string;
  email: string;
  eloRating: number;
  wins: number;
  losses: number;
}

export interface AuthResponse {
  userId: number;
  username: string;
  token: string;
}

export interface UserStats {
  wins: number;
  losses: number;
  eloRating: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  eloRating: number;
  wins: number;
  losses: number;
}
