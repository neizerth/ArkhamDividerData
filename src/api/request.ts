import axios, { AxiosRequestConfig } from "node_modules/axios/index";

type ResponseType = 'json' | 'text';

export const getWithPrefix = (baseURL: string) => {
  const client = axios.create({
    baseURL
  })
  return (path: string, config?: AxiosRequestConfig) => client.get(path, config);
};