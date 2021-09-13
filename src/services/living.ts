import requestAPI from '@/utils/request';
import { IdAndName } from './global';

export interface LivingServiceData {
  Id: 'a0A8s0000006mOXEAY';
  IsDeleted: false;
  Name: 'LH-38881';
  A_Loan_Application__c: '0068s0000006dt7AAA';
  A_Account__c: '0018s000001R9ZhAAK';
  A_Address__c: null;
  A_From_Date__c: '2021-10-01';
  A_To_Date__c: '2021-10-14';
  Fact_Find__c: 'a0S8s00000003xBEAQ';
  Comments__c: null;
  A_Address_Type__c: null;
  A_Building_Name__c: '3';
  A_City__c: '6';
  A_Comments__c: null;
  A_Country__c: '7';
  A_Floor_Number__c: '2';
  A_Housing_Situation__c: 'Own Home With Mortgage';
  A_Loankit_Address_Id__c: null;
  A_Mercury_Unique_ID__c: null;
  A_Postcode__c: '2000';
  A_State__c: 'New South Wales';
  A_Street_Type__c: 'Street';
  A_Street__c: '5';
  A_Street_number__c: '4';
  A_Type_Of_Address__c: 'Previous';
  A_Unit_Number__c: '1';
  Address_Type_Mercury__c: 'Home';
  Account_Name__c: 'Vincent Tang';
  Current_Address__c: null;
  Full_Address__c: 'Floor 2  Unit 1  3  4  5 Street  6  New South Wales 7 2000';
}
export async function getLivingService(id: string) {
  const res = await requestAPI<LivingServiceData>({
    url: `/living/${id}`,
    method: 'get',
  });
  return res.data;
}

export interface UpdateLivingServiceParams {
  id: string;
  data: any;
}

export async function updateLivingService({
  id,
  data,
}: UpdateLivingServiceParams) {
  const res = await requestAPI<null>({
    url: `/living/${id}`,
    method: 'put',
    data,
  });
  return res.data;
}

export interface CreateLivingServiceParams {
  A_Loan_Application__c: string;
  Fact_Find__c: string;
  [key: string]: any;
}

export async function createLivingService(data: CreateLivingServiceParams) {
  const res = await requestAPI<IdAndName>({
    url: `/living`,
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteLivingService(id: string) {
  const res = await requestAPI<null>({
    url: `/living/${id}`,
    method: 'delete',
  });
  return res.data;
}
