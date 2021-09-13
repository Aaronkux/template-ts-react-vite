import requestAPI from '@/utils/request';
import { IdAndName } from './global';

export interface AssetsServiceData {
  Id?: 'a018s000001A9CjAAK';
  Name?: 'aatc';
  A_Account_Name__c?: null;
  A_Account_Number__c?: null;
  A_Account_Type__c?: null;
  A_Account__c?: '0018s0000012egjAAA';
  A_Address__c?: '2398 sdkjfksdjf';
  A_Asset_Amount__c?: null;
  A_Asset_Type__c?: 'Real Estate';
  Contact_Name_for_Valuer_Access__c?: null;
  A_Bsb__c?: null;
  A_Description__c?: null;
  A_Financial_Institution__c?: null;
  A_Monthly_Rental_Income__c?: null;
  A_Loan_Application__c?: '0068s0000006xv3AAA';
  A_Other_Institution__c?: null;
  A_Property_is_being_purchased__c?: null;
  A_Purchase_Date__c?: null;
  A_Use_as_security__c?: null;
  A_Vehicle_Make__c?: null;
  A_Vehicle_Year__c?: null;
  Vehicle_Model__c?: null;
  Vehicle_Value__c?: null;
  Value_Basis__c?: null;
  Motor_Type__c?: null;
  LoanKit_Financial_Institution__c?: null;
  Contact_number_for_valuer_access__c?: null;
  Currency__c?: null;
  A_Address_Type__c?: null;
  A_Asset_Value__c?: null;
  A_Building_Name__c?: null;
  A_End_Date__c?: null;
  A_Loankit_Address_Id__c?: null;
  A_Loankit_Asset_Id__c?: null;
  A_Mercury_Unique_ID__c?: null;
  A_Primary_Purpose__c?: null;
  A_Start_Date__c?: null;
  A_Type_of_Address__c?: null;
  A_Zoning__c?: null;
  city__c?: null;
  country__c?: null;
  floor_number__c?: null;
  postcode__c?: null;
  state__c?: null;
  street__c?: null;
  street_number__c?: null;
  street_type__c?: null;
  unit_number__c?: null;
  Intent__c?: null;
  Interest_Rate__c?: null;
  Currency_to_be_RMB__c?: false;
  Lender__c?: null;
  Security__c?: null;
  Market_Value_for_NCCP__c?: null;
  Purpose_for_NCCP__c?: null;
  Intent_for_NCCP__c?: null;
  Ownership1__c?: null;
  Ownership2__c?: null;
  Percentage1__c?: null;
  Percentage2__c?: null;
  Product_Type_for_NCCP__c?: null;
  Source_of_Value__c?: null;
  Owner1__c?: null;
  Owner2__c?: null;
  Ownership3__c?: null;
  Ownership4__c?: null;
  Percentage3__c?: null;
  Percentage4__c?: null;
  Company_Type__c?: null;
  Company_Name__c?: null;
  Company_ABN__c?: null;
  Company_Mailing_Address__c?: null;
  Postcode_Sol__c?: null;
  State_Sol__c?: null;
  Contact_Name__c?: null;
  Phone_Number__c?: null;
  Fax_Number__c?: null;
  Email__c?: null;
  Website__c?: null;
  ADDRESS__c?: null;
  Ownership1_Email__c?: null;
  Primary_Account_Phone_Number__c?: null;
  Secondary_Account_Phone_Number__c?: null;
  Primary_Account_Email__c?: 'abc@aaa.com';
  Secondary_Account_Email__c?: null;
  Security_Type__c?: null;
  Fact_Find__c?: 'a0S8s00000004hxEAA';
}
export async function getAssetsService(id: string) {
  const res = await requestAPI<AssetsServiceData>({
    url: `/asset/${id}`,
    method: 'get',
  });
  return res.data;
}

export interface UpdateAssetsServiceParams {
  id: string;
  data: any;
}

export async function updateAssetsService({
  id,
  data,
}: UpdateAssetsServiceParams) {
  const res = await requestAPI<null>({
    url: `/asset/${id}`,
    method: 'put',
    data,
  });
  return res.data;
}

export interface CreateAssetsServiceParams {
  A_Loan_Application__c: string;
  A_Account__c: string;
  Fact_Find__c: string;
  [key: string]: any;
}

export async function createAssetsService(data: CreateAssetsServiceParams) {
  const res = await requestAPI<IdAndName>({
    url: `/asset`,
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteAssetsService(id: string) {
  const res = await requestAPI<null>({
    url: `/asset/${id}`,
    method: 'delete',
  });
  return res.data;
}
