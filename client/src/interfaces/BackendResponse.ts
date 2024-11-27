export interface BackendResponse<T> extends Response {
  data: T;
}
