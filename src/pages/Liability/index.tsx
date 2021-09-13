import {
  LiabilityServiceData,
  createLiabilityService,
  CreateLiabilityServiceParams,
  getLiabilityService,
  updateLiabilityService,
  UpdateLiabilityServiceParams,
} from '@/services/liability';
import { Button, Input, message, Radio, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FieldDecorator from '@/components/FieldDecorator';
import ContentTitle from '@/components/ContentTitle';
import PageWrapper from '@/components/PageWrapper';
import classnames from 'classnames';
import { ErrorResponse, IdAndName } from '@/services/global';
import { LoadingOutlined } from '@ant-design/icons';
import { getLoanListService } from '@/services/loan';
import { useAuth } from '@/hooks/useAuth';
import { getBankService } from '@/services/bank';
import Loading from '@/components/Loading';

const totalPage = 1;

const { Option } = Select;

const schema = yup
  .object({
    A_Liability_Type__c: yup.string().nullable().required('Required'),
    Name: yup.string().nullable().required('Required'),
    A_Clear_from_this_account__c: yup.string().nullable().required('Required'),
    A_Asset__c: yup
      .string()
      .nullable()
      .when('A_Liability_Type__c', {
        is: 'Mortgage Loan',
        then: yup.string().nullable().required('Required'),
      }),
  })
  .required();

const requirementPageFields = [
  'Name',
  'A_Liability_Type__c',
  'A_Clear_from_this_account__c',
  'A_Other_Institution__c',
  'A_BSB_No__c',
  'A_Account_No__c',
  'A_Limit_Amount__c',
  'A_Amount_Owing__c',
  'A_Monthly_Repayment__c',
  'Credit_Card_Type__c',
  'A_Interest_Rate__c',
  'PI_Loan_Term_Month__c',
  'Overall_Loan_Term_Month__c',
  'A_Asset__c',
  'Financial_Institution__c',
];

const otherPageLiabilityTypes = [
  'Commercial Bill',
  'Contingent Liability',
  'Hire Purchase',
  'Lease',
  'Line Of Credit',
  'Loan as Guarantor',
  'Maintenance',
  'Ongoing Rent',
  'Other Loan',
  'Outstanding Taxation',
  'Overdraft',
  'Store Card',
  'Personal Loan', // need change title
  'Term Loan',
  'Other',
];

const commonNullCondition = ['HECS', 'Rental Outgo'];
const interestNullCondition = ['HECS', 'Rental Outgo', 'Credit Card'];

export default function Liability() {
  const { liabilityId, id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const factFindId = params.get('factFindId');
  const { user } = useAuth();
  const accountId = user?.Account;
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { control, handleSubmit, reset, watch, trigger, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { data: loanListData, isLoading: loanListLoading } = useQuery(
    'loanlist',
    () => getLoanListService(accountId!),
    {
      enabled: !!accountId,
      onError: (err: ErrorResponse) => {
        message.error(err.errorMsg);
      },
    }
  );

  const { data: bankData, isLoading: bankLoading } = useQuery(
    'bank',
    () => getBankService(),
    {
      onError: (err: ErrorResponse) => {
        message.error(err.errorMsg);
      },
    }
  );

  const { isFetching } = useQuery<LiabilityServiceData, ErrorResponse>(
    ['liability', liabilityId],
    () => getLiabilityService(liabilityId!),
    {
      enabled: !!liabilityId && liabilityId !== 'new',
      onSettled: (res: any) => {
        if (res) {
          let filteredFields: any = {};
          requirementPageFields.forEach((field) => {
            filteredFields[field] = res[field];
          });
          reset(filteredFields);
        }
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );

  // update data
  const updateLiability = useMutation<
    null,
    ErrorResponse,
    UpdateLiabilityServiceParams
  >('updateLiability', updateLiabilityService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries(['liability', liabilityId]);
      queryClient.invalidateQueries('loanlist');
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  // update data
  const createLiability = useMutation<
    IdAndName,
    ErrorResponse,
    CreateLiabilityServiceParams
  >('createLiability', createLiabilityService, {
    onSuccess: (data) => {
      message.success('Liability Created');
      queryClient.invalidateQueries('loanlist');
      navigate(`../liability/${data.Id}`, { replace: true });
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  const onFormNext = async () => {
    const validateRes = await trigger();
    if (validateRes) setCurrentPage(currentPage + 1);
  };

  const onFinish = (submitData: any) => {
    if (liabilityId !== 'new') {
      updateLiability.mutate({
        id: liabilityId!,
        data: submitData,
      });
    } else {
      if (!id) {
        message.error(`Loan Id can't be empty`);
        return;
      } else if (!factFindId) {
        message.error(`FactFind Id can't be empty`);
        return;
      }
      createLiability.mutate({
        A_Opportunity__c: id!,
        Fact_Find__c: factFindId!,
        ...submitData,
      });
    }
  };

  useEffect(() => {
    if (liabilityId === 'new') {
      requirementPageFields.forEach((field) => {
        setValue(field, null);
      });
    }
  }, [liabilityId, setValue]);

  const [A_Liability_Type__c] = watch(['A_Liability_Type__c']);
  return !isFetching ? (
    <div className="font-semibold h-full overflow-y-auto flex flex-col">
      <form className="overflow-x-hidden px-10 pt-6 grow">
        <SwitchTransition>
          <CSSTransition
            key={currentPage}
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
            }}
            classNames="pageSwitch"
          >
            <div>
              {currentPage === 1 && (
                <>
                  <ContentTitle
                    title="Liability Details"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Name"
                      label="Liability Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Liability_Type__c"
                      label="Liability Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="Commercial Bill" value={'Commercial Bill'}>
                          Commercial Bill
                        </Option>
                        <Option
                          key="Contingent Liability"
                          value={'Contingent Liability'}
                        >
                          Contingent Liability
                        </Option>
                        <Option key="Credit Card" value={'Credit Card'}>
                          Credit Card
                        </Option>
                        <Option key="HECS" value={'HECS'}>
                          HECS
                        </Option>
                        <Option key="Hire Purchase" value={'Hire Purchase'}>
                          Hire Purchase
                        </Option>
                        <Option key="Lease" value={'Lease'}>
                          Lease
                        </Option>
                        <Option key="Line Of Credit" value={'Line Of Credit'}>
                          Line Of Credit
                        </Option>
                        <Option
                          key="Loan as Guarantor"
                          value={'Loan as Guarantor'}
                        >
                          Loan as Guarantor
                        </Option>
                        <Option key="Maintenance" value={'Maintenance'}>
                          Maintenance
                        </Option>
                        <Option key="Mortgage Loan" value={'Mortgage Loan'}>
                          Mortgage Loan
                        </Option>
                        <Option key="Ongoing Rent" value={'Ongoing Rent'}>
                          Ongoing Rent
                        </Option>
                        <Option key="Other Loan" value={'Other Loan'}>
                          Other Loan
                        </Option>
                        <Option
                          key="Outstanding Taxation"
                          value={'Outstanding Taxation'}
                        >
                          Outstanding Taxation
                        </Option>
                        <Option key="Overdraft" value={'Overdraft'}>
                          Overdraft
                        </Option>
                        <Option key="Personal Loan" value={'Personal Loan'}>
                          Personal Loan
                        </Option>
                        <Option key="Rental Outgo" value={'Rental Outgo'}>
                          Rental Outgo
                        </Option>
                        <Option key="Store Card" value={'Store Card'}>
                          Store Card
                        </Option>
                        <Option key="Term Loan" value={'Term Loan'}>
                          Term Loan
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Clear_from_this_account__c"
                      label="Clear from this account?"
                      control={control}
                      setValue={setValue}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                  </PageWrapper>

                  {otherPageLiabilityTypes.includes(A_Liability_Type__c) && (
                    <ContentTitle
                      title={
                        A_Liability_Type__c === 'Personal Loan'
                          ? 'Personal'
                          : 'Other'
                      }
                      hiddenPage
                    />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      visible={otherPageLiabilityTypes.includes(
                        A_Liability_Type__c
                      )}
                      name="Financial_Institution__c"
                      label="Financial Institution"
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Select
                        allowClear
                        showSearch
                        loading={bankLoading}
                        optionFilterProp={'children'}
                      >
                        {bankData?.records.map((bank) => (
                          <Option key={bank.Id} value={bank.Id}>
                            {bank.A_Bank_Name__c}
                          </Option>
                        ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={otherPageLiabilityTypes.includes(
                        A_Liability_Type__c
                      )}
                      name="A_Other_Institution__c"
                      label="Lenders"
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={otherPageLiabilityTypes.includes(
                        A_Liability_Type__c
                      )}
                      name="A_BSB_No__c"
                      label="BSB No."
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={otherPageLiabilityTypes.includes(
                        A_Liability_Type__c
                      )}
                      name="A_Account_No__c"
                      label="Account No."
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={otherPageLiabilityTypes.includes(
                        A_Liability_Type__c
                      )}
                      name="A_Limit_Amount__c"
                      label="Limit Amount"
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={otherPageLiabilityTypes.includes(
                        A_Liability_Type__c
                      )}
                      name="A_Amount_Owing__c"
                      label="Amount Owing"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={otherPageLiabilityTypes.includes(
                        A_Liability_Type__c
                      )}
                      name="A_Monthly_Repayment__c"
                      label="Monthly Repayment"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={otherPageLiabilityTypes.includes(
                        A_Liability_Type__c
                      )}
                      name="A_Interest_Rate__c"
                      label="Interest Rate %"
                      control={control}
                      setValue={setValue}
                      setNullCondition={interestNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                  </PageWrapper>
                  {A_Liability_Type__c === 'Credit Card' && (
                    <ContentTitle title={'Credit Card'} hiddenPage />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Credit Card'}
                      name="Financial_Institution__c"
                      label="Financial Institution"
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Select
                        allowClear
                        showSearch
                        loading={bankLoading}
                        optionFilterProp={'children'}
                      >
                        {bankData?.records.map((bank) => (
                          <Option key={bank.Id} value={bank.Id}>
                            {bank.A_Bank_Name__c}
                          </Option>
                        ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Credit Card'}
                      name="A_Other_Institution__c"
                      label="Lenders"
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Credit Card'}
                      name="A_BSB_No__c"
                      label="BSB No."
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Credit Card'}
                      name="A_Account_No__c"
                      label="Account No."
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Credit Card'}
                      name="Credit_Card_Type__c"
                      label="Credit Card Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="Amex" value="Amex">
                          Amex
                        </Option>
                        <Option key="Diners" value="Diners">
                          Diners
                        </Option>
                        <Option key="Mastercard" value="Mastercard">
                          Mastercard
                        </Option>
                        <Option key="Visa" value="Visa">
                          Visa
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Credit Card'}
                      name="A_Limit_Amount__c"
                      label="Limit Amount"
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Credit Card'}
                      name="A_Amount_Owing__c"
                      label="Amount Owing"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Credit Card'}
                      name="A_Monthly_Repayment__c"
                      label="Monthly Repayment"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                  </PageWrapper>
                  {A_Liability_Type__c === 'HECS' && (
                    <ContentTitle title={'HECS'} hiddenPage />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'HECS'}
                      name="A_Amount_Owing__c"
                      label="Amount Owing"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'HECS'}
                      name="A_Monthly_Repayment__c"
                      label="Monthly Repayment"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                  </PageWrapper>
                  {A_Liability_Type__c === 'Mortgage Loan' && (
                    <ContentTitle title={'Mortgage'} hiddenPage />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="A_Asset__c"
                      label="Asset"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear loading={loanListLoading}>
                        {loanListData
                          ?.find((item) => item.Id === id)
                          ?.A_Asset__c?.map((item) => (
                            <Option key={item.Name} value={item.Id}>
                              {item.Name}
                            </Option>
                          ))}
                      </Select>
                    </FieldDecorator>
                    <div />
                    <div />
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="Financial_Institution__c"
                      label="Financial Institution"
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Select
                        allowClear
                        showSearch
                        loading={bankLoading}
                        optionFilterProp={'children'}
                      >
                        {bankData?.records.map((bank) => (
                          <Option key={bank.Id} value={bank.Id}>
                            {bank.A_Bank_Name__c}
                          </Option>
                        ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="A_Other_Institution__c"
                      label="Lenders"
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="A_BSB_No__c"
                      label="BSB No."
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="A_Account_No__c"
                      label="Account No."
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="A_Limit_Amount__c"
                      label="Limit Amount"
                      control={control}
                      setValue={setValue}
                      setNullCondition={commonNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="A_Amount_Owing__c"
                      label="Amount Owing"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="A_Interest_Rate__c"
                      label="Interest Rate %"
                      control={control}
                      setValue={setValue}
                      setNullCondition={interestNullCondition.includes(
                        A_Liability_Type__c
                      )}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="PI_Loan_Term_Month__c"
                      label="IO Loan Term (Month)"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="Overall_Loan_Term_Month__c"
                      label="Remaining Loan Term (Month)"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Mortgage Loan'}
                      name="A_Monthly_Repayment__c"
                      label="Monthly Repayment"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                  </PageWrapper>
                  {A_Liability_Type__c === 'Rental Outgo' && (
                    <ContentTitle title={'Rental Outgo'} hiddenPage />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Rental Outgo'}
                      name="A_Amount_Owing__c"
                      label="Amount Owing"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Liability_Type__c === 'Rental Outgo'}
                      name="A_Monthly_Repayment__c"
                      label="Monthly Repayment"
                      control={control}
                      setValue={setValue}
                      setNullCondition={false}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                  </PageWrapper>
                </>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </form>
      <div
        style={{ boxShadow: '0 0 10px 1px rgba(0,0,0,0.1)' }}
        className="flex justify-between items-center px-16 py-4 w-full h-16]"
      >
        <Button
          type="primary"
          className={classnames('rounded-lg font-bold', {
            invisible: currentPage === 1,
          })}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          PREVIOUS
        </Button>
        {currentPage === totalPage ? (
          <Button
            type="primary"
            className="rounded-lg font-bold"
            onClick={handleSubmit(onFinish)}
            style={{ width: '86px' }}
          >
            {updateLiability.isLoading ? (
              <LoadingOutlined style={{ fontSize: '18px' }} />
            ) : (
              'SUBMIT'
            )}
          </Button>
        ) : (
          <Button
            type="primary"
            className="rounded-lg font-bold"
            onClick={onFormNext}
          >
            NEXT
          </Button>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
}
