import requestAPI from '@/utils/request';

interface BankData {
  A_Bank_Name__c: string;
  Id: string;
}

export interface BankServiceData {
  records: BankData[];
  totalSize: number;
  done: boolean;
}

export async function getBankService() {
  const res = await requestAPI<BankServiceData>({
    url: `/banks`,
    method: 'get',
  });
  return res.data;
}
