

interface PaginatedResult<T> {
  size: number;
  token: string;
  result: T[];
}

type TagsResult = PaginatedResult<string>;

export type LinkTags = TagsResult;
export type ObjectTags = TagsResult;

export interface Rule {
  count: number;
  fromTag: string;
  fromConstraint: string;
  linkTag: string;
  toTag: string;
  toConstraint: string;
}

export type Rules = PaginatedResult<Rule>;

export interface LinkInfo {
  count: number;
  linked: boolean;
}

export interface User {
  id: string;
  timestamp: number;
  secret: string;
}

export type Users = PaginatedResult<User>;
