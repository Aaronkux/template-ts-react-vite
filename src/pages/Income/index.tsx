import {
  IncomeServiceData,
  createIncomeService,
  CreateIncomeServiceParams,
  getIncomeService,
  updateIncomeService,
  UpdateIncomeServiceParams,
} from '@/services/income';
import { Button, Input, message, Select } from 'antd';
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
import { useAuth } from '@/hooks/useAuth';
import { getLoanListService } from '@/services/loan';
import Loading from '@/components/Loading';

const totalPage = 1;

const { Option } = Select;

const schema = yup
  .object({
    Name: yup.string().nullable().required('Required'),
    Account__c: yup.string().nullable().required('Required'),
    A_Income_Period__c: yup.string().nullable().required('Required'),
    A_Income_Type__c: yup.string().nullable().required('Required'),
    A_Employment__c: yup.string().nullable().required('Required'),
  })
  .required();

const requirementPageFields = [
  'Name',
  'Account__c',
  'Source_of_Income__c',
  'A_Income_Period__c',
  'A_Income_Type__c',
  'A_Income_Value__c',
  'A_Employment__c',
];

export default function Income() {
  const { incomeId, id } = useParams();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const accountId = user?.Account;
  const navigate = useNavigate();
  const factFindId = params.get('factFindId');
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { control, handleSubmit, reset, trigger, setValue } = useForm({
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

  const { isFetching } = useQuery<IncomeServiceData, ErrorResponse>(
    ['income', incomeId],
    () => getIncomeService(incomeId!),
    {
      enabled: !!incomeId && incomeId !== 'new',
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
  const updateIncome = useMutation<
    null,
    ErrorResponse,
    UpdateIncomeServiceParams
  >('updateIncome', updateIncomeService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries(['income', incomeId]);
      queryClient.invalidateQueries('loanlist');
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  // update data
  const createIncome = useMutation<
    IdAndName,
    ErrorResponse,
    CreateIncomeServiceParams
  >('createIncome', createIncomeService, {
    onSuccess: (data) => {
      message.success('Income Created');
      queryClient.invalidateQueries('loanlist');
      navigate(`../income/${data.Id}`, { replace: true });
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
    if (incomeId !== 'new') {
      updateIncome.mutate({
        id: incomeId!,
        data: submitData,
      });
    } else {
      if (!id) {
        message.error(`Loan Id can't be empty`);
        return;
      } else if (!factFindId) {
        message.error(`FactFind Id can't be empty`);
        return;
      } else if (!accountId) {
        message.error(`Account Id can't be empty`);
        return;
      }
      createIncome.mutate({
        ...submitData,
        A_Opportunity__c: id!,
        Fact_Find__c: factFindId!,
      });
    }
  };

  useEffect(() => {
    if (incomeId === 'new') {
      requirementPageFields.forEach((field) => {
        setValue(field, null);
      });
    }
  }, [incomeId, setValue]);

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
                    title="Income Details"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Name"
                      label="Income Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Account__c"
                      label="Applicant Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear loading={loanListLoading}>
                        {loanListData
                          ?.find((item) => item.Id === id)
                          ?.Contact?.map((item) => (
                            <Option key={item.Name} value={item.Id}>
                              {item.Name}
                            </Option>
                          ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Employment__c"
                      label="Employment"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear loading={loanListLoading}>
                        {loanListData
                          ?.find((item) => item.Id === id)
                          ?.A_Employment__c?.map((item) => (
                            <Option key={item.Name} value={item.Id}>
                              {item.Name}
                            </Option>
                          ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Source_of_Income__c"
                      label="Source of Income"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option value="Local" key="Local">
                          Local
                        </Option>
                        <Option value="Overseas" key="Overseas">
                          Overseas
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Income_Period__c"
                      label="Income Period"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option value="Daily" key="Daily">
                          Daily
                        </Option>
                        <Option value="Weekly" key="Weekly">
                          Weekly
                        </Option>
                        <Option value="Fortnightly" key="Fortnightly">
                          Fortnightly
                        </Option>
                        <Option value="Bi-Monthly" key="Bi-Monthly">
                          Bi-Monthly
                        </Option>
                        <Option value="Monthly" key="Monthly">
                          Monthly
                        </Option>
                        <Option value="Yearly" key="Yearly">
                          Yearly
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Income_Type__c"
                      label="Income Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option value="Addback" key="Addback">
                          Addback
                        </Option>
                        <Option value="Annuities" key="Annuities">
                          Annuities
                        </Option>
                        <Option value="Bonus" key="Bonus">
                          Bonus
                        </Option>
                        <Option value="Commission" key="Commission">
                          Commission
                        </Option>
                        <Option
                          value="Company Profit Before Tax"
                          key="Company Profit Before Tax"
                        >
                          Company Profit Before Tax
                        </Option>
                        <Option value="Dividends" key="Dividends">
                          Dividends
                        </Option>
                        <Option value="Foreign Sourced" key="Foreign Sourced">
                          Foreign Sourced
                        </Option>
                        <Option
                          value="Government Benefits"
                          key="Government Benefits"
                        >
                          Government Benefits
                        </Option>
                        <Option
                          value="Gross Regular Overtime"
                          key="Gross Regular Overtime"
                        >
                          Gross Regular Overtime
                        </Option>
                        <Option
                          value="Gross Yearly Income"
                          key="Gross Yearly Income"
                        >
                          Gross Yearly Income
                        </Option>
                        <Option value="Interest Income" key="Interest Income">
                          Interest Income
                        </Option>
                        <Option
                          value="Not Regular Overtime"
                          key="Not Regular Overtime"
                        >
                          Not Regular Overtime
                        </Option>
                        <Option value="Other Income" key="Other Income">
                          Other Income
                        </Option>
                        <Option value="Private Pension" key="Private Pension">
                          Private Pension
                        </Option>
                        <Option value="Rental" key="Rental">
                          Rental
                        </Option>
                        <Option value="Superannuation" key="Superannuation">
                          Superannuation
                        </Option>
                        <Option value="Work Allowance" key="Work Allowance">
                          Work Allowance
                        </Option>
                        <Option
                          value="Workers Compensation"
                          key="Workers Compensation"
                        >
                          Workers Compensation
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Income_Value__c"
                      label="Income Value"
                      control={control}
                      setValue={setValue}
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
            {updateIncome.isLoading ? (
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
