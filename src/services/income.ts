import requestAPI from '@/utils/request';
import { IdAndName } from './global';

export interface IncomeServiceData {
  Id: 'a058s000000LPTFAA4';
  Name: 'aabbcc';
  A_Description__c: 'a';
  A_Employment__c: 'a048s000000BNKfAAO';
  A_Income_Name__c: null;
  A_Income_Period__c: 'Daily';
  A_Income_Type__c: 'Gross Yearly Income';
  A_Income_Value__c: 123;
  A_Net_Monthly_Salary__c: 1;
  A_Opportunity__c: '0068s0000006dt7AAA';
  Account__c: '0018s000001R9oDAAS';
  Annual_Income__c: 1;
  Investment_Income__c: null;
  Government_Payments__c: null;
  A_Commence_Date__c: '2021-10-06';
  A_Loankit_IncomeId__c: null;
  A_Mercury_Unique_ID__c: null;
  Commence_Date__c: null;
  Account_Name__c: 'Andy Zeng';
  Employer_Name__c: 'sdfsdffd';
  Fact_Find__c: 'a0S8s00000003xBEAQ';
  Source_of_Income__c: 'Local';
  Total_Annual_Income__c: 44895;
}
export async function getIncomeService(id: string) {
  const res = await requestAPI<IncomeServiceData>({
    url: `/income/${id}`,
    method: 'get',
  });
  return res.data;
}

export interface UpdateIncomeServiceParams {
  id: string;
  data: any;
}

export async function updateIncomeService({
  id,
  data,
}: UpdateIncomeServiceParams) {
  const res = await requestAPI<null>({
    url: `/income/${id}`,
    method: 'put',
    data,
  });
  return res.data;
}

export interface CreateIncomeServiceParams {
  A_Opportunity__c: string;
  Fact_Find__c: string;
  [key: string]: any;
}

export async function createIncomeService(data: CreateIncomeServiceParams) {
  const res = await requestAPI<IdAndName>({
    url: `/income`,
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteIncomeService(id: string) {
  const res = await requestAPI<null>({
    url: `/income/${id}`,
    method: 'delete',
  });
  return res.data;
}
