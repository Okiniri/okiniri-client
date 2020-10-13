

export interface PaginatedResult<T> {
  size: number;
  token: string;
  result: T[];
}

export interface Rule {
  count: number;
  fromTag: string;
  fromConstraint: string;
  linkTag: string;
  toTag: string;
  toConstraint: string;
}

export interface LinkInfo {
  count: number;
  linked: boolean;
}

export interface User {
  id: string;
  timestamp: number;
  secret: string;
}
