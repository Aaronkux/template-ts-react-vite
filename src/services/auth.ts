import requestAPI from '@/utils/request';

export interface LoginServiceParams {
  username: string;
  password: string;
}

export interface LoginServiceData {
  Access_Token_Expire__c: string;
  Access_Token__c: string;
  Account: string;
  Id: string;
  Refresh_Token_Expire__c: string;
  Refresh_Token__c: string;
}
export async function loginService(data: LoginServiceParams) {
  const res = await requestAPI<LoginServiceData>({
    url: '/login',
    method: 'post',
    data: {
      Username__c: data.username,
      Password__c: data.password,
    },
  });
  return res.data;
}
