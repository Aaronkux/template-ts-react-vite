import requestAPI from '@/utils/request';
import { IdAndName } from './global';

export interface LoanListServiceData {
  Id: string;
  Name: string;
  Contact: IdAndName[];
  Living_History__c: IdAndName[];
  A_Liability__c: IdAndName[];
  Loan_Information__c: IdAndName[];
  A_Income__c: IdAndName[];
  Fact_Find__c: IdAndName[];
  Expenses__c: IdAndName[];
  A_Employment__c: IdAndName[];
  Credit_History__c: IdAndName[];
  A_Asset__c: IdAndName[];
}
export async function getLoanListService(id: string) {
  const res = await requestAPI<LoanListServiceData[]>({
    url: `/objectsinfo/${id}`,
    method: 'get',
  });
  return res.data;
}
