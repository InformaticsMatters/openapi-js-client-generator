/** Based off the example custom-instance from Orval docs
 * https://github.com/anymaniax/orval/blob/master/samples/react-app-with-react-query/src/api/mutator/custom-instance.ts
 *
 * See https://react-query.tanstack.com/guides/query-cancellation
 *
 * TODO: Considering using Fetch-API instead of axios. This instance will have to change. Could be
 * achieved without changing much using `redaxios`
 * Or use 'ky'
 */

import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create();

/**
 * Set the access token to be added as the `Authorization: Bearer 'token'` header
 * Useful for client only apps where a proxy API route isn't involved to securely add the access token
 * @param token access token
 */
export const setAuthToken = (token: string) => {
  AXIOS_INSTANCE.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Set the url to which request paths are added to.
 * @param baseUrl origin + subpath e.g. 'https://example.com/subpath' or '/subpath'
 */
export const setBaseUrl = (baseUrl: string) => {
  AXIOS_INSTANCE.defaults.baseURL = baseUrl;
};

export const customInstance = <TReturn>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<TReturn> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({ ...config, ...options, cancelToken: source.token }).then(
    ({ data }) => data,
  );

  // Promise doesn't have a cancel method but react-query requires this method to make cancellations general.
  // This can either be a any assertion or a @ts-ignore comment.
  (promise as any).cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};

export type ErrorType<TError> = AxiosError<TError>;
