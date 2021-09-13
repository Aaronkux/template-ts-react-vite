import {
  FactFindServiceData,
  getFactFindService,
  updateFactFindService,
  UpdateFactFindServiceParams,
} from '@/services/factfind';
import { Button, Input, message, Select } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FieldDecorator from '@/components/FieldDecorator';
import ContentTitle from '@/components/ContentTitle';
import PageWrapper from '@/components/PageWrapper';
import classnames from 'classnames';
import { ErrorResponse } from '@/services/global';
import { LoadingOutlined } from '@ant-design/icons';
import Loading from '@/components/Loading';

const totalPage = 2;

const { Option } = Select;

const schema = yup
  .object({
    // Priority_for_Fixed_Rate__c: yup.string().nullable(),
    // Fixed_Term__c: yup
    //   .string()
    //   .nullable()
    //   .when('Priority_for_Fixed_Rate__c', {
    //     is: 'Must have',
    //     then: yup.string().nullable().required('Required'),
    //   }),
  })
  .required();

const requirementPageFields = [
  'Priority_for_Fixed_Rate__c',
  'Fixed_Term__c',
  'Priority_for_Variable_rate__c',
  'Reason_for_Variable_rate__c',
  'Other_Reasons_for_Variable_Rate__c',
  'Priority_for_Introductory_rate__c',
  'Reason_for_Introductory_rate__c',
  'Other_Reasons_for_Introductory_Rate__c',
  'Priority_of_Fixed_and_Variable_Rate__c',
  'Reason_for_Fixed_and_Variable_rate__c',
  'Other_Reasons_for_Fixed_Variable_rate__c',
  'Priority_for_P_I__c',
  'Reason_for_P_I__c',
  'Other_Reasons_for_P_I__c',
  'Priority_for_Interest_only__c',
  'I_O_Term__c',
  'Reason_for_Interest_only__c',
  'Other_Reason_for_Interest_only__c',
  'Priority_for_Line_of_credit__c',
  'Reason_for_Line_of_credit__c',
  'Other_Reason_for_Line_of_credit__c',
  'Priority_for_Non_conforming__c',
  'Reason_for_Non_conforming__c',
  'Other_Reason_for_Non_conforming__c',
  'Priority_for_Low_doc__c',
  'Reason_for_Low_doc__c',
  'Other_Reason_for_Low_doc__c',
  'Priority_for_Offset__c',
  'Reason_for_Offset__c',
  'Other_Reason_for_Offset__c',
  'Priority_for_Redraw__c',
  'Reason_for_Redraw__c',
  'Other_Reason_for_Redraw__c',
  'Priority_for_Other_features__c',
  'Reason_for_Other_features__c',
  'Other_Reason_for_Other_features__c',
  'What_is_your_preferred_bank__c',
  'Other_Reasons_for_Fixed_Rate__c',
  'Reason_for_Fixed_Rate__c',
];

export default function Requirement() {
  const { factFindId } = useParams();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { control, handleSubmit, reset, watch, trigger, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { isFetching } = useQuery<FactFindServiceData, ErrorResponse>(
    'factFind',
    () => getFactFindService(factFindId!),
    {
      enabled: !!factFindId,
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
  const updateFactFind = useMutation<
    null,
    ErrorResponse,
    UpdateFactFindServiceParams
  >('updateFactFind', updateFactFindService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries('factFind');
      setCurrentPage(1);
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
    updateFactFind.mutate({
      id: factFindId!,
      data: submitData,
    });
  };

  const [
    Priority_for_Fixed_Rate__c,
    Reason_for_Fixed_Rate__c,
    Priority_for_Variable_rate__c,
    Reason_for_Variable_rate__c,
    Priority_for_Introductory_rate__c,
    Reason_for_Introductory_rate__c,
    Priority_of_Fixed_and_Variable_Rate__c,
    Reason_for_Fixed_and_Variable_rate__c,
    Priority_for_P_I__c,
    Reason_for_P_I__c,
    Priority_for_Interest_only__c,
    Reason_for_Interest_only__c,
    Priority_for_Line_of_credit__c,
    Reason_for_Line_of_credit__c,
    Priority_for_Non_conforming__c,
    Reason_for_Non_conforming__c,
    Priority_for_Low_doc__c,
    Reason_for_Low_doc__c,
    Priority_for_Offset__c,
    Reason_for_Offset__c,
    Priority_for_Redraw__c,
    Reason_for_Redraw__c,
    Priority_for_Other_features__c,
    Reason_for_Other_features__c,
  ] = watch([
    'Priority_for_Fixed_Rate__c',
    'Reason_for_Fixed_Rate__c',
    'Priority_for_Variable_rate__c',
    'Reason_for_Variable_rate__c',
    'Priority_for_Introductory_rate__c',
    'Reason_for_Introductory_rate__c',
    'Priority_of_Fixed_and_Variable_Rate__c',
    'Reason_for_Fixed_and_Variable_rate__c',
    'Priority_for_P_I__c',
    'Reason_for_P_I__c',
    'Priority_for_Interest_only__c',
    'Reason_for_Interest_only__c',
    'Priority_for_Line_of_credit__c',
    'Reason_for_Line_of_credit__c',
    'Priority_for_Non_conforming__c',
    'Reason_for_Non_conforming__c',
    'Priority_for_Low_doc__c',
    'Reason_for_Low_doc__c',
    'Priority_for_Offset__c',
    'Reason_for_Offset__c',
    'Priority_for_Redraw__c',
    'Reason_for_Redraw__c',
    'Priority_for_Other_features__c',
    'Reason_for_Other_features__c',
  ]);

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
                    title="Rate Type"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Priority_for_Fixed_Rate__c"
                      label="Fixed Rate"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Fixed_Rate__c === 'Must have'}
                      name="Fixed_Term__c"
                      label="Fixed Term"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Fixed_Rate__c === 'Must have'}
                      name="Reason_for_Fixed_Rate__c"
                      label="Reason for Fixed Rate"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Stability of repayments"
                          value={'Stability of repayments'}
                        >
                          Stability of repayments
                        </Option>
                        <Option
                          key="Make budgeting easier"
                          value={'Make budgeting easier'}
                        >
                          Make budgeting easier
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_Fixed_Rate__c === 'Other'}
                      name="Other_Reasons_for_Fixed_Rate__c"
                      label="Other Reasons for Fixed Rate"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <div />
                    <div />
                    <FieldDecorator
                      name="Priority_for_Variable_rate__c"
                      label="Var. rate"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Variable_rate__c === 'Must have'}
                      name="Reason_for_Variable_rate__c"
                      label="Reason for Variable rate"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Flexibility with Repayment"
                          value={'Flexibility with Repayment'}
                        >
                          Flexibility with Repayment
                        </Option>
                        <Option
                          key="Take advantage of potential future decreases"
                          value={'Take advantage of potential future decreases'}
                        >
                          Take advantage of potential future decreases
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_Variable_rate__c === 'Other'}
                      name="Other_Reasons_for_Variable_Rate__c"
                      label="Other Reasons for Variable Rate"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Priority_for_Introductory_rate__c"
                      label="Intro Rate"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={
                        Priority_for_Introductory_rate__c === 'Must have'
                      }
                      name="Reason_for_Introductory_rate__c"
                      label="Reason for Introductory rate"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Minimize initial repayments"
                          value={'Minimize initial repayments'}
                        >
                          Minimize initial repayments
                        </Option>
                        <Option
                          key="Principal reductions during intro period"
                          value={'Principal reductions during intro period'}
                        >
                          Principal reductions during intro period
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_Introductory_rate__c === 'Other'}
                      name="Other_Reasons_for_Introductory_Rate__c"
                      label="Other Reasons for Introductory Rate"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Priority_of_Fixed_and_Variable_Rate__c"
                      label="Split Loans"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={
                        Priority_of_Fixed_and_Variable_Rate__c === 'Must have'
                      }
                      name="Reason_for_Fixed_and_Variable_rate__c"
                      label="Reason for Split Loan"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Limit risk of increasing variable rate"
                          value={'Limit risk of increasing variable rate'}
                        >
                          Limit risk of increasing variable rate
                        </Option>
                        <Option
                          key="Make budgeting easier than 100% variable"
                          value={'Make budgeting easier than 100% variable'}
                        >
                          Make budgeting easier than 100% variable
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={
                        Reason_for_Fixed_and_Variable_rate__c === 'Other'
                      }
                      name="Other_Reasons_for_Fixed_Variable_rate__c"
                      label="Other Reasons for Fixed & Variable rate"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                  </PageWrapper>
                  <ContentTitle title="Repayment Type" hiddenPage />
                  <PageWrapper>
                    <FieldDecorator
                      name="Priority_for_P_I__c"
                      label="P & I"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_P_I__c === 'Must have'}
                      name="Reason_for_P_I__c"
                      label="Reason for P&I"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Minimize interest paid over life of loan"
                          value={'Minimize interest paid over life of loan'}
                        >
                          Minimize interest paid over life of loan
                        </Option>
                        <Option
                          key="Higher lending limit"
                          value={'Higher lending limit'}
                        >
                          Higher lending limit
                        </Option>
                        <Option
                          key="Build up equity from start"
                          value={'Build up equity from start'}
                        >
                          Build up equity from start
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_P_I__c === 'Other'}
                      name="Other_Reasons_for_P_I__c"
                      label="Other Reasons for P&I"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      name="Priority_for_Interest_only__c"
                      label="IO"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Interest_only__c === 'Must have'}
                      name="I_O_Term__c"
                      label="I/O Term"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Interest_only__c === 'Must have'}
                      name="Reason_for_Interest_only__c"
                      label="Reason for Interest only"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Negative gearing for investment"
                          value={'Negative gearing for investment'}
                        >
                          Negative gearing for investment
                        </Option>
                        <Option
                          key="Preserve cash flow"
                          value={'Preserve cash flow'}
                        >
                          Preserve cash flow
                        </Option>
                        <Option key="Construction" value={'Construction'}>
                          Construction
                        </Option>
                        <Option key="Tax benefits" value={'Tax benefits'}>
                          Tax benefits
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>

                    <FieldDecorator
                      visible={Reason_for_Interest_only__c === 'Other'}
                      name="Other_Reason_for_Interest_only__c"
                      label="Other Reason for Interest only"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <div />
                    <div />

                    <FieldDecorator
                      name="Priority_for_Line_of_credit__c"
                      label="Line of credit"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Line_of_credit__c === 'Must have'}
                      name="Reason_for_Line_of_credit__c"
                      label="Reason for Line of credit"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Readily available funds"
                          value={'Readily available funds'}
                        >
                          Readily available funds
                        </Option>
                        <Option
                          key="Minimize additional liability"
                          value={'Minimize additional liability'}
                        >
                          Minimize additional liability
                        </Option>
                        <Option
                          key="Minimize total interest paid"
                          value={'Minimize total interest paid'}
                        >
                          Minimize total interest paid
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_Line_of_credit__c === 'Other'}
                      name="Reason_for_Line_of_credit__c"
                      label="Other Reason for Line of credit"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                  </PageWrapper>
                </>
              )}
              {currentPage === 2 && (
                <>
                  <ContentTitle
                    title="Special Loan Type"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Priority_for_Non_conforming__c"
                      label="Non-conforming"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Non_conforming__c === 'Must have'}
                      name="Reason_for_Non_conforming__c"
                      label="Reason for Non-conforming"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Adverse financial history"
                          value={'Adverse financial history'}
                        >
                          Adverse financial history
                        </Option>
                        <Option
                          key="Unable to qualify for normal loan"
                          value={'Unable to qualify for normal loan'}
                        >
                          Unable to qualify for normal loan
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_Non_conforming__c === 'Other'}
                      name="Other_Reason_for_Non_conforming__c"
                      label="Other Reason for Non-conforming"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      name="Priority_for_Low_doc__c"
                      label="Low doc"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Low_doc__c === 'Must have'}
                      name="Reason_for_Low_doc__c"
                      label="Reason for Low doc"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Financials and tax not completed"
                          value={'Financials and tax not completed'}
                        >
                          Financials and tax not completed
                        </Option>
                        <Option
                          key="Financials too complex for prime"
                          value={'Financials too complex for prime'}
                        >
                          Financials too complex for prime
                        </Option>
                        <Option
                          key="Lesser documentation"
                          value={'Lesser documentation'}
                        >
                          Lesser documentation
                        </Option>
                        <Option key="Faster process" value={'Faster process'}>
                          Faster process
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_Low_doc__c === 'Other'}
                      name="Other_Reason_for_Low_doc__c"
                      label="Other Reason for Low doc"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                  </PageWrapper>
                  <ContentTitle title="Loan Features" hiddenPage />
                  <PageWrapper>
                    <FieldDecorator
                      name="Priority_for_Offset__c"
                      label="OFFSET"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Offset__c === 'Must have'}
                      name="Reason_for_Offset__c"
                      label="Reason for Offset"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Pay less interest over life of loan"
                          value={'Pay less interest over life of loan'}
                        >
                          Pay less interest over life of loan
                        </Option>
                        <Option
                          key="Pay off loan sooner"
                          value={'Pay off loan sooner'}
                        >
                          Pay off loan sooner
                        </Option>
                        <Option
                          key="Allow access to funds"
                          value={'Allow access to funds'}
                        >
                          Allow access to funds
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_Offset__c === 'Other'}
                      name="Other_Reason_for_Offset__c"
                      label="Other Reason for Offset"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      name="Priority_for_Redraw__c"
                      label="REDRAW"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Redraw__c === 'Must have'}
                      name="Reason_for_Redraw__c"
                      label="Reason for Redraw"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Flexibility to access funds if needed"
                          value={'Flexibility to access funds if needed'}
                        >
                          Flexibility to access funds if needed
                        </Option>
                        <Option
                          key="Ability to minimize interest"
                          value={'Ability to minimize interest'}
                        >
                          Ability to minimize interest
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_Redraw__c === 'Other'}
                      name="Other_Reason_for_Redraw__c"
                      label="Other Reason for Redraw"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      name="Priority_for_Other_features__c"
                      label="Priority for Other features"
                      control={control}
                      setValue={setValue}
                    >
                      <WillingSelect />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Priority_for_Other_features__c === 'Must have'}
                      name="Reason_for_Other_features__c"
                      label="Reason for Other features"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="ATM" value={'ATM'}>
                          ATM
                        </Option>
                        <Option key="Branch Access" value={'Branch Access'}>
                          Branch Access
                        </Option>
                        <Option key="Debit Card" value={'Debit Card'}>
                          Debit Card
                        </Option>
                        <Option key="Extra Repayment" value={'Extra Repayment'}>
                          Extra Repayment
                        </Option>
                        <Option key="Internet bank" value={'Internet bank'}>
                          Internet bank
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={Reason_for_Other_features__c === 'Other'}
                      name="Other_Reason_for_Other_features__c"
                      label="Other Reason for Other features"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      name="What_is_your_preferred_bank__c"
                      label="What is your preferred bank?"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
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
            {updateFactFind.isLoading ? (
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

const WillingSelect = React.forwardRef((props, ref: any) => {
  return (
    <Select allowClear {...props} ref={ref}>
      <Option key="Must have" value={'Must have'}>
        Must have
      </Option>
      <Option key="Nice to have" value={'Nice to have'}>
        Nice to have
      </Option>
      <Option key="Optional" value={'Optional'}>
        Optional
      </Option>
    </Select>
  );
});
