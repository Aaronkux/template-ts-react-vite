import requestAPI from '@/utils/request';
import { IdAndName } from './global';

export interface CreditServiceData {
  Id: 'a458s00000001ddAAA';
  IsDeleted: false;
  Name: 'CH-00792';
  Fact_Find__c: 'a0S8s00000004hxEAA';
  Opportunity__c: '0068s0000006xv3AAA';
  Judgement_default_or_legal_proceeding__c: 'No';
  Any_recent_credit_enquiries__c: 'No';
  Credit_commitment_update_below_limit__c: 'Yes';
  Have_you_even_been_in_bankruptcy__c: null;
  Any_directorship_needs_confirm__c: 'No';
  Please_provide_explanation_judgement__c: null;
  Please_provide_explanation_enquiries__c: null;
  Please_provide_explanation_commitment__c: null;
  Please_provide_explanation_bankruptcy__c: null;
  Please_provide_explanation_Directorship__c: null;
  Applicant_Name__c: '0018s0000012egjAAA';
  Applicant__c: 'Lion Ma';
}
export async function getCreditService(id: string) {
  const res = await requestAPI<CreditServiceData>({
    url: `/credit/${id}`,
    method: 'get',
  });
  return res.data;
}

export interface UpdateCreditServiceParams {
  id: string;
  data: any;
}

export async function updateCreditService({
  id,
  data,
}: UpdateCreditServiceParams) {
  const res = await requestAPI<null>({
    url: `/credit/${id}`,
    method: 'put',
    data,
  });
  return res.data;
}

export interface CreateCreditServiceParams {
  Opportunity__c: string;
  Fact_Find__c: string;
  [key: string]: any;
}

export async function createCreditService(data: CreateCreditServiceParams) {
  const res = await requestAPI<IdAndName>({
    url: `/credit`,
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteCreditService(id: string) {
  const res = await requestAPI<null>({
    url: `/credit/${id}`,
    method: 'delete',
  });
  return res.data;
}
