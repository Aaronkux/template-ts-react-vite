import requestAPI from '@/utils/request';
import { IdAndName } from './global';

export interface ExpenseServiceData {
  Id: 'a098s000000aTY9AAM';
  IsDeleted: false;
  Name: 'Exp-36093';
  A_Opportunity__c: '0068s0000006xv3AAA';
  A_Account__c: '0018s0000012egjAAA';
  Currency_to_be_RMB__c: false;
  Alcohol__c: null;
  Notes_on_Living_Expense__c: null;
  Car_Expenses__c: 0;
  Other_Notes__c: null;
  Child__c: null;
  NCCP_Use__c: 'False';
  Clothing_Personal_Care__c: 0;
  Notes__c: null;
  Eating_Out__c: null;
  Child_Care__c: 0;
  Educational_Expense__c: 0;
  Alcohol_Tobacco__c: null;
  Government_Debts__c: null;
  Entertainment_Cost__c: 0;
  Groceries_Food__c: 0;
  Media_Phone_Internet__c: null;
  Insurance__c: 0;
  Transport_Fee__c: null;
  Mobile_Phone__c: 0;
  Rental_Property_Costs__c: 0;
  Fact_Find__c: 'a0S8s00000004hxEAA';
  Other_Entertainment__c: null;
  Other__c: 0;
  Declared_living_expense_lower_than_HEM__c: null;
  Power_Gas_Water__c: null;
  Please_provide_satisfactory_explanation__c: null;
  Rates__c: null;
  Any_living_expenses_remains_undeclared__c: null;
  Telephone__c: null;
  Please_advise__c: null;
  Tobacco__c: null;
  Electricity__c: 0;
  Water__c: 0;
  Total_Living_Expense__c: null;
  Rental_Boarding_Expense_Monthly__c: null;
  Monthly_Living_Expenses__c: null;
  Recreation_Entertainment__c: null;
  Internet__c: 0;
  Cable_TV__c: 0;
  Owner_Occupied_Costs__c: 0;
  INV_Porperty_Costs__c: 0;
  Gas__c: 0;
  Public_Transportation__c: 0;
  Parking_Toll_Fee__c: 0;
  A_Mercury_Unique_ID__c: null;
  A_Type__c: null;
  Expense_Type__c: null;
  Monthly_Repayment__c: null;
  Balance__c: null;
  Credit_Limit__c: null;
  Account_Name__c: 'Lion Ma';
  Medical_Health_Cost__c: 0;
  Life_Health_Insurance__c: null;
  Other_Insurance__c: null;
}
export async function getExpenseService(id: string) {
  const res = await requestAPI<ExpenseServiceData>({
    url: `/expense/${id}`,
    method: 'get',
  });
  return res.data;
}

export interface UpdateExpenseServiceParams {
  id: string;
  data: any;
}

export async function updateExpenseService({
  id,
  data,
}: UpdateExpenseServiceParams) {
  const res = await requestAPI<null>({
    url: `/expense/${id}`,
    method: 'put',
    data,
  });
  return res.data;
}

export interface CreateExpenseServiceParams {
  A_Opportunity__c: string;
  A_Account__c: string;
  Fact_Find__c: string;
  [key: string]: any;
}

export async function createExpenseService(data: CreateExpenseServiceParams) {
  const res = await requestAPI<IdAndName>({
    url: `/expense`,
    method: 'post',
    data,
  });
  return res.data;
}

export async function deleteExpenseService(id: string) {
  const res = await requestAPI<null>({
    url: `/expense/${id}`,
    method: 'delete',
  });
  return res.data;
}
