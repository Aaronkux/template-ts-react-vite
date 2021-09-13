import requestAPI from '@/utils/request';
import { IdAndName } from './global';

export interface EmploymentServiceData {
  Id: 'a048s000000BNKfAAO';
  IsDeleted: false;
  Name: 'sdfsdffd';
  ABN_No__c: '123214';
  A_Building_Name__c: '1';
  A_Country__c: 'Australia';
  A_Current_or_Previous__c: 'Current';
  A_Employer_Name__c: 'sdfsdffd';
  A_Employment_Name__c: null;
  A_Employment_Sector__c: null;
  A_Employment_Status__c: 'Full Time';
  A_Employment_Type__c: 'PAYG';
  A_End_Date__c: '2021-10-14';
  A_Floor_Number__c: 3;
  A_Limit_Amount__c: null;
  A_Monthly_Repayment__c: null;
  A_Occupation_Role__c: null;
  A_Opportunity__c: '0068s0000006dt7AAA';
  A_Postcode__c: '2000';
  A_Primary_Employment__c: 'Yes';
  A_Prior_Employment__c: null;
  A_Start_Date__c: '2021-10-06';
  A_State__c: 'Australian Capital Territory';
  A_Street_Name__c: '5';
  A_Street_Number__c: '4';
  A_Street_Type__c: 'Street';
  A_SuburbCity__c: '6';
  A_Unit_Number__c: '2';
  Position__c: 'IT';
  A_Applicant_Name__c: '0018s0000012egjAAA';
  Phone_Number__c: '42142141';
  Contact_Person__c: 'ASD';
  Tax_residency_TIN__c: null;
  A_Loankit_Address_Id__c: null;
  A_Loankit_EmployementId__c: null;
  A_Mercury_Unique_ID__c: null;
  A_Type_of_Address__c: null;
  Company_Name__c: null;
  Gross_Annual_Income__c: null;
  Net_Monthly_Income__c: null;
  Employer_Address__c: '2 4 5 Street 6 Australian Capital Territory Australia 2000';
  Account_Name__c: 'Lion Ma';
  Company_Mailing_Address__c: null;
  Accountant_Phone_Number__c: null;
  Fax_Number__c: null;
  Contact_Name__c: null;
  Email__c: null;
  State__c: null;
  Postcode__c: null;
  Account_Visa__c: 'ASD123214';
  Account_Country_of_Residency__c: null;
  Account_Permanent_Australian_Resident__c: 'Yes';
  Account_Residency_Status__c: 'Permanent Resident';
  Fact_Find__c: 'a0S8s00000003xBEAQ';
  GST_registered__c: null;
  ACN__c: null;
  share_of_ownership__c: null;
  TPB_Registered__c: null;
  Probation__c: false;
  Employment__c: null;
}
export async function getEmploymentService(id: string) {
  const res = await requestAPI<EmploymentServiceData>({
    url: `/employment/${id}`,
    method: 'get',
  });
  return res.data;
}

export interface UpdateEmploymentServiceParams {
  id: string;
  data: any;
}

export async function updateEmploymentService({
  id,
  data,
}: UpdateEmploymentServiceParams) {
  const res = await requestAPI<null>({
    url: `/employment/${id}`,
    method: 'put',
    data,
  });
  return res.data;
}

export interface CreateEmploymentServiceParams {
  A_Opportunity__c: string;
  A_Applicant_Name__c: string;
  Fact_Find__c: string;
  [key: string]: any;
}

export async function createEmploymentService(
  data: CreateEmploymentServiceParams
) {
  const res = await requestAPI<IdAndName>({
    url: `/employment`,
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteEmploymentService(id: string) {
  const res = await requestAPI<null>({
    url: `/employment/${id}`,
    method: 'delete',
  });
  return res.data;
}
