type ExtractParams<
  Path extends string,
  T extends string | number,
> = Path extends `${string}://${infer AfterProtocol}`
  ? ExtractParams<AfterProtocol, T>
  : Path extends `${string}:${infer Param}/${infer Rest}`
    ? { [key in Param | keyof ExtractParams<`/${Rest}`, T>]: T }
    : Path extends `${string}:${infer Param}`
      ? { [key in Param]: T }
      : object;

type WithSearchParamsInit =
  | string
  | URLSearchParams
  | string[][]
  | Record<string, string | number | undefined | null>
  | undefined;

type WithParamsInit<T extends string> = ExtractParams<T, string | number>;
type SafeParseParams<T extends string> = ExtractParams<T, string>;

export class RouteBuilder<const T extends string> {
  private path: string;

  constructor(path: T) {
    this.path = path;
  }

  withParams(params: WithParamsInit<T>) {
    let newPath = this.path;

    for (const key in params) {
      const param = params[key];
      if (!param) continue;
      newPath = newPath.replace(`:${key}`, String(param));
    }

    return new RouteBuilder(newPath as T);
  }

  withSearchParams(params: WithSearchParamsInit) {
    if (!params) return this;

    const query = this.buildQueryParams(params);
    const queryString = query.toString();
    return queryString
      ? new RouteBuilder(`${this.path}?${queryString}` as T)
      : this;
  }

  private buildQueryParams(params: WithSearchParamsInit): URLSearchParams {
    if (params instanceof URLSearchParams) {
      return params;
    }

    const query = new URLSearchParams();

    if (typeof params === 'string') {
      return new URLSearchParams(params);
    }

    if (Array.isArray(params)) {
      for (const [key, value] of params) {
        if (key && value) query.append(key, value);
      }
      return query;
    }

    if (typeof params === 'object') {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined || value !== null)
          query.append(key, String(value));
      }
      return query;
    }

    return query;
  }

  safeParse(url: string): null | SafeParseParams<T> {
    const params: Record<string, string> = {};

    const regex = new RegExp(
      `^${this.path.replace(/:([^/?]+)/g, '(?<$1>[^/?]+)')}$`,
    );

    const match = url.match(regex);
    if (!match?.groups) return null;

    for (const [key, value] of Object.entries(match.groups)) {
      params[key] = value;
    }

    return params as SafeParseParams<T>;
  }

  toString() {
    return this.path;
  }
}
