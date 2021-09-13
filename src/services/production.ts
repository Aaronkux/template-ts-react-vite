import requestAPI from '@/utils/request';
import { IdAndName } from './global';

export interface ProductionServiceData {
  Id: 'a238s0000004mqrAAA';
  IsDeleted: false;
  Name: 'LS-15227';
  Security__c: '0068s0000006dt7AAA';
  LVR_New__c: 50;
  Account_Type__c: null;
  Product_Type__c: '2 Year Fixed';
  Loan_Purposes__c: 'Investment';
  Variable_Discount_Approved__c: null;
  Fixed_Discount_Approved__c: null;
  Interest_Rate_Approved__c: 1;
  Discount_After_Fixed_Period__c: null;
  FHOG__c: false;
  Rate_Lock__c: 'Yes';
  Security_Name__c: 'testb';
  Loan_Amount__c: 1;
  Repayment_Type__c: 'Interest Only';
  IO_Term__c: '1 Year';
  Loan_Term__c: 1;
  Existing_Loan_Amount__c: 1;
  LVR__c: null;
  Market_Value__c: 1;
  Intent__c: 'Other';
  Asset__c: 'a018s000001dWDxAAM';
  Rate_Locked__c: false;
  Reason_for_IO__c: 'adfkjkjjk';
  Features__c: 'Line of Credit;Low Doc;Access to Loan via ATM';
  Repayment_Amount__c: 1;
  Other_Intent__c: '1';
  Fact_Find__c: 'a0S8s00000003xBEAQ';
  Asset2__c: 'a018s000001UbpdAAC';
  Market_Value_2__c: 1;
  LMI_Premium__c: 1;
  LMI_Options__c: 'To be Paid by Client';
}
export async function getProductionService(id: string) {
  const res = await requestAPI<ProductionServiceData>({
    url: `/loaninfo/${id}`,
    method: 'get',
  });
  return res.data;
}

export interface UpdateProductionServiceParams {
  id: string;
  data: any;
}

export async function updateProductionService({
  id,
  data,
}: UpdateProductionServiceParams) {
  const res = await requestAPI<null>({
    url: `/loaninfo/${id}`,
    method: 'put',
    data,
  });
  return res.data;
}

export interface CreateProductionServiceParams {
  Security__c: string;
  Fact_Find__c: string;
  [key: string]: any;
}

export async function createProductionService(
  data: CreateProductionServiceParams
) {
  const res = await requestAPI<IdAndName>({
    url: `/loaninfo`,
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteProductionService(id: string) {
  const res = await requestAPI<null>({
    url: `/loaninfo/${id}`,
    method: 'delete',
  });
  return res.data;
}
