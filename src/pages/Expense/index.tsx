import {
  ExpenseServiceData,
  createExpenseService,
  CreateExpenseServiceParams,
  getExpenseService,
  updateExpenseService,
  UpdateExpenseServiceParams,
} from '@/services/expense';
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

const totalPage = 2;

const { Option } = Select;

const schema = yup
  .object({
    A_Account__c: yup.string().nullable().required('Required'),
  })
  .required();

const requirementPageFields = [
  'A_Account__c',
  'Groceries_Food__c',
  'Clothing_Personal_Care__c',
  'Entertainment_Cost__c',
  'Mobile_Phone__c',
  'Internet__c',
  'Cable_TV__c',
  'Rental_Property_Costs__c',
  'Owner_Occupied_Costs__c',
  'INV_Porperty_Costs__c',
  'Electricity__c',
  'Gas__c',
  'Water__c',
  'Public_Transportation__c',
  'Car_Expenses__c',
  'Child_Care__c',
  'Parking_Toll_Fee__c',
  'Medical_Health_Cost__c',
  'Car_Expenses__c',
  'Insurance__c',
  'Educational_Expense__c',
  'Child__c',
  'Other__c',
  'Notes__c',
];

export default function Expense() {
  const { expenseId, id } = useParams();
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

  const { isFetching } = useQuery<ExpenseServiceData, ErrorResponse>(
    ['expense', expenseId],
    () => getExpenseService(expenseId!),
    {
      enabled: !!expenseId && expenseId !== 'new',
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
  const updateExpense = useMutation<
    null,
    ErrorResponse,
    UpdateExpenseServiceParams
  >('updateExpense', updateExpenseService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries(['expense', expenseId]);
      queryClient.invalidateQueries('loanlist');
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  // update data
  const createExpense = useMutation<
    IdAndName,
    ErrorResponse,
    CreateExpenseServiceParams
  >('createExpense', createExpenseService, {
    onSuccess: (data) => {
      message.success('Expense Created');
      queryClient.invalidateQueries('loanlist');
      navigate(`../expense/${data.Id}`, { replace: true });
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
    if (expenseId !== 'new') {
      updateExpense.mutate({
        id: expenseId!,
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
      createExpense.mutate({
        A_Opportunity__c: id!,
        Fact_Find__c: factFindId!,
        A_Account__c: accountId!,
        Expense_Type__c: 'Living Expenses',
        ...submitData,
      });
    }
  };

  useEffect(() => {
    if (expenseId === 'new') {
      requirementPageFields.forEach((field) => {
        setValue(field, null);
      });
    }
  }, [expenseId, setValue]);

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
                    title="Monthly Expense Details"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="A_Account__c"
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
                  </PageWrapper>
                  <ContentTitle title="Personal" hiddenPage />
                  <PageWrapper>
                    <FieldDecorator
                      name="Groceries_Food__c"
                      label="Groceries/Food"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Clothing_Personal_Care__c"
                      label="Clothing/Personal Care"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Entertainment_Cost__c"
                      label="Recreation / Entertainment"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                  </PageWrapper>
                  <ContentTitle title="Connections" hiddenPage />
                  <PageWrapper>
                    <FieldDecorator
                      name="Mobile_Phone__c"
                      label="Mobile Phone"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Internet__c"
                      label="Internet"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Cable_TV__c"
                      label="Cable TV"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                  </PageWrapper>
                  <ContentTitle title="Accomodation" hiddenPage />
                  <PageWrapper>
                    <FieldDecorator
                      name="Rental_Property_Costs__c"
                      label="Rental Property Costs"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Owner_Occupied_Costs__c"
                      label="Owner Occupied Costs"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="INV_Porperty_Costs__c"
                      label="INV Property Costs"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Electricity__c"
                      label="Electricity"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Gas__c"
                      label="Gas"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Water__c"
                      label="Water"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                  </PageWrapper>
                </>
              )}
              {currentPage === 2 && (
                <>
                  <ContentTitle
                    title="Transportation"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Public_Transportation__c"
                      label="Public Transportation"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Car_Expenses__c"
                      label="Car Expenses"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Parking_Toll_Fee__c"
                      label="Parking & Toll Fee"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                  </PageWrapper>
                  <ContentTitle title="Others" hiddenPage />
                  <PageWrapper>
                    <FieldDecorator
                      name="Medical_Health_Cost__c"
                      label="Medical & Health Cost"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Child_Care__c"
                      label="Child Care"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Insurance__c"
                      label="General Insurance"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Educational_Expense__c"
                      label="Educational Expense"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Child__c"
                      label="Child Support"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Other__c"
                      label="Other"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>

                    <FieldDecorator
                      name="Notes__c"
                      label="Expenses Notes"
                      control={control}
                      setValue={setValue}
                    >
                      <Input.TextArea rows={4} />
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
            {updateExpense.isLoading ? (
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
