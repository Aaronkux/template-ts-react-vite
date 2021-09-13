/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */
import {
  token_key,
  refresh_token_key,
  user_key,
} from '@/components/AuthProvider';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

function requestAPI<T>(axiosConfig: AxiosRequestConfig): AxiosPromise<T> {
  const service = axios.create({
    baseURL: 'https://api.awardmortgage.com.au',
    timeout: 10000,
  });

  service.interceptors.request.use((config) => {
    const token = localStorage.getItem(token_key);
    // typeof window !== "undefined" 兼容ssr
    if (token && typeof window !== 'undefined') {
      config.headers!.Authorization = `Token ${token}`;
    }

    return config;
  });

  service.interceptors.response.use(
    (response) => {
      if (!response.data.success) {
        return Promise.reject({
          code: response.data.statusCode,
          errorMsg: response.data.errorMessage,
        });
      }
      return response.data;
    },
    async (error) => {
      if (error.response.status === 401) {
        const refreshToken = localStorage.getItem(refresh_token_key);
        if (!refreshToken) Promise.reject(error);
        const refreshRes = await axios.post(
          'https://api.awardmortgage.com.au/refreshtoken',
          {
            refreshToken,
          }
        );
        if (refreshRes.status === 200 && refreshRes.data.success) {
          const user = refreshRes.data.data;
          localStorage.setItem(token_key, user.Access_Token__c);
          localStorage.setItem(refresh_token_key, user.Refresh_Token__c);
          localStorage.setItem(user_key, JSON.stringify(user));
          error.config.headers!.Authorization = `Token ${user.Access_Token__c}`;
          return (await axios(error.config)).data;
        } else {
          localStorage.setItem(token_key, '');
          localStorage.setItem(refresh_token_key, '');
          localStorage.setItem(user_key, '');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error); // 错误继续返回给到具体页面
    }
  );

  return service(axiosConfig);
}

export default requestAPI;
// const refreshToken = localStorage.getItem(refresh_token_key);
//         if (!refreshToken) {
//           return Promise.reject({
//             code: 401,
//             errorMsg: 'refresh token is empty',
//           });
//         }
//         let data = new FormData();
//         data.append('refresh_token', refreshToken);
