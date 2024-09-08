import axios, { AxiosRequestConfig } from "axios";

type ResponseType = 'json' | 'text';

export const getWithPrefix = (baseURL: string) => {
  const client = axios.create({
    baseURL
  })
  return <T>(path: string, config?: AxiosRequestConfig) => client.get<T>(path, config);
};