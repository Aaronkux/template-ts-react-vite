import {
  CreditServiceData,
  createCreditService,
  CreateCreditServiceParams,
  getCreditService,
  updateCreditService,
  UpdateCreditServiceParams,
} from '@/services/credit';
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
import { useAuth } from '@/hooks/useAuth';
import { getLoanListService } from '@/services/loan';
import Loading from '@/components/Loading';

const totalPage = 1;

const { Option } = Select;

const schema = yup
  .object({
    Applicant_Name__c: yup.string().nullable().required('Required'),
  })
  .required();

const requirementPageFields = [
  'Please_provide_explanation_judgement__c',
  'Please_provide_explanation_enquiries__c',
  'Please_provide_explanation_commitment__c',
  'Please_provide_explanation_bankruptcy__c',
  'Please_provide_explanation_Directorship__c',
  'Judgement_default_or_legal_proceeding__c',
  'Have_you_even_been_in_bankruptcy__c',
  'Credit_commitment_update_below_limit__c',
  'Any_recent_credit_enquiries__c',
  'Any_directorship_needs_confirm__c',
  'Applicant_Name__c',
];

export default function Credit() {
  const { creditId, id } = useParams();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const accountId = user?.Account;
  const navigate = useNavigate();
  const factFindId = params.get('factFindId');
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { control, handleSubmit, reset, trigger, setValue, watch } = useForm({
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

  const { isFetching } = useQuery<CreditServiceData, ErrorResponse>(
    ['credit', creditId],
    () => getCreditService(creditId!),
    {
      enabled: !!creditId && creditId !== 'new',
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
  const updateCredit = useMutation<
    null,
    ErrorResponse,
    UpdateCreditServiceParams
  >('updateCredit', updateCreditService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries(['credit', creditId]);
      queryClient.invalidateQueries('loanlist');
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  // update data
  const createCredit = useMutation<
    IdAndName,
    ErrorResponse,
    CreateCreditServiceParams
  >('createCredit', createCreditService, {
    onSuccess: (data) => {
      message.success('Credit Created');
      queryClient.invalidateQueries('loanlist');
      navigate(`../credit/${data.Id}`, { replace: true });
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
    if (creditId !== 'new') {
      updateCredit.mutate({
        id: creditId!,
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
      createCredit.mutate({
        ...submitData,
        Opportunity__c: id!,
        Fact_Find__c: factFindId!,
      });
    }
  };

  const [
    Judgement_default_or_legal_proceeding__c,
    Have_you_even_been_in_bankruptcy__c,
    Credit_commitment_update_below_limit__c,
    Any_recent_credit_enquiries__c,
    Any_directorship_needs_confirm__c,
  ] = watch([
    'Judgement_default_or_legal_proceeding__c',
    'Have_you_even_been_in_bankruptcy__c',
    'Credit_commitment_update_below_limit__c',
    'Any_recent_credit_enquiries__c',
    'Any_directorship_needs_confirm__c',
  ]);

  useEffect(() => {
    if (creditId === 'new') {
      requirementPageFields.forEach((field) => {
        setValue(field, null);
      });
    }
  }, [creditId, setValue]);

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
                    title="Credit Details"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Applicant_Name__c"
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
                    <div />
                    <div />
                    <FieldDecorator
                      name="Judgement_default_or_legal_proceeding__c"
                      label="Judgement, default or legal proceeding?"
                      control={control}
                      setValue={setValue}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Please_provide_explanation_judgement__c"
                      label="Please provide explanation"
                      control={control}
                      setValue={setValue}
                      visible={
                        Judgement_default_or_legal_proceeding__c === 'Yes'
                      }
                    >
                      <Input />
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      name="Any_recent_credit_enquiries__c"
                      label="Any recent credit enquiries?"
                      control={control}
                      setValue={setValue}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Please_provide_explanation_enquiries__c"
                      label="Please provide explanation"
                      control={control}
                      setValue={setValue}
                      visible={Any_recent_credit_enquiries__c === 'Yes'}
                    >
                      <Input />
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      name="Credit_commitment_update_below_limit__c"
                      label="Credit commitment update & below limit"
                      control={control}
                      setValue={setValue}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Please_provide_explanation_commitment__c"
                      label="Please provide explanation"
                      control={control}
                      setValue={setValue}
                      visible={
                        Credit_commitment_update_below_limit__c === 'Yes'
                      }
                    >
                      <Input />
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      name="Have_you_even_been_in_bankruptcy__c"
                      label="Have you even been in bankruptcy?"
                      control={control}
                      setValue={setValue}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Please_provide_explanation_bankruptcy__c"
                      label="Please provide explanation"
                      control={control}
                      setValue={setValue}
                      visible={Have_you_even_been_in_bankruptcy__c === 'Yes'}
                    >
                      <Input />
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      name="Any_directorship_needs_confirm__c"
                      label="Any directorship needs confirm?"
                      control={control}
                      setValue={setValue}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Please_provide_explanation_Directorship__c"
                      label="Please provide explanation"
                      control={control}
                      setValue={setValue}
                      visible={Any_directorship_needs_confirm__c === 'Yes'}
                    >
                      <Input />
                    </FieldDecorator>
                    <div />
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
            {updateCredit.isLoading ? (
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
