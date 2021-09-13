import requestAPI from '@/utils/request';
import { IdAndName } from './global';

export interface LiabilityServiceData {
  Id?: 'a068s0000007PHpAAM';
  Name?: 'test';
  A_Account_No__c?: null;
  A_Amount_Owing__c?: null;
  A_Asset__c?: 'a018s000001A9CjAAK';
  A_BSB_No__c?: null;
  A_Clear_from_this_account__c?: null;
  A_Interest_Rate__c?: null;
  A_Other_Institution__c?: null;
  A_Liability_Type__c?: 'Mortgage Loan';
  A_Limit_Amount__c?: null;
  A_Monthly_Repayment__c?: null;
  A_Opportunity__c?: '0068s0000006xv3AAA';
  A_Product_Description__c?: null;
  Financial_Institution__c?: null;
  Overall_Loan_Term__c?: null;
  Overall_Loan_Term_Month__c?: null;
  PI_Loan_Term_Year__c?: null;
  PI_Loan_Term_Month__c?: null;
  Account_Name__c?: null;
  Credit_Card_Type__c?: null;
  A_Expense_type__c?: null;
  A_Loankit_Liability_Id__c?: null;
  A_Mercury_Unique_ID__c?: null;
  Bank_Name__c?: null;
  Currency_to_be_RMB__c?: false;
  A_Amount_Owing_New__c?: null;
  Fact_Find__c?: 'a0S8s00000004hxEAA';
}
export async function getLiabilityService(id: string) {
  const res = await requestAPI<LiabilityServiceData>({
    url: `/liability/${id}`,
    method: 'get',
  });
  return res.data;
}

export interface UpdateLiabilityServiceParams {
  id: string;
  data: any;
}

export async function updateLiabilityService({
  id,
  data,
}: UpdateLiabilityServiceParams) {
  const res = await requestAPI<null>({
    url: `/liability/${id}`,
    method: 'put',
    data,
  });
  return res.data;
}

export interface CreateLiabilityServiceParams {
  Fact_Find__c: string;
  [key: string]: any;
}

export async function createLiabilityService(
  data: CreateLiabilityServiceParams
) {
  const res = await requestAPI<IdAndName>({
    url: `/liability`,
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteLiabilityService(id: string) {
  const res = await requestAPI<null>({
    url: `/liability/${id}`,
    method: 'delete',
  });
  return res.data;
}
