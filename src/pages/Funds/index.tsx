/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  FactFindServiceData,
  getFactFindService,
  updateFactFindService,
  UpdateFactFindServiceParams,
} from '@/services/factfind';
import { Button, Input, message } from 'antd';
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

const totalPage = 1;

const schema = yup
  .object({
    // Priority_for_Fixed_Rate__c: yup.string().nullable(),
  })
  .required();

const requirementPageFields = [
  'Purchase_Amount__c',
  'Loan_Sought__c',
  'Refinance_Amount__c',
  'FHOG__c',
  'LMI_To_be_paid__c',
  'LMI_To_be_Added__c',
  'Stamp_Duty_Transfer_of_Land__c',
  'Sales_Proceed_Gross__c',
  'Titles_Office_Mortgage__c',
  'Deposit_Paid__c',
  'Titles_Office_Transfer_of_Land__c',
  'Deposit_at_Hand__c',
  'Establishment_Fee__c',
  'Others__c',
  'Legal_Cost__c',
  'Discharge_Cost__c',
  'Other_Sundries__c',
];

const tranformToNumber = (val: any) => {
  if (val) {
    return parseFloat(val);
  }
  return 0;
};

export default function Funds() {
  const { factFindId } = useParams();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { control, handleSubmit, reset, trigger, setValue, watch } = useForm({
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
  const [
    Purchase_Amount__c,
    Loan_Sought__c,
    Refinance_Amount__c,
    FHOG__c,
    LMI_To_be_paid__c,
    LMI_To_be_Added__c,
    Stamp_Duty_Transfer_of_Land__c,
    Titles_Office_Mortgage__c,
    Deposit_Paid__c,
    Titles_Office_Transfer_of_Land__c,
    Deposit_at_Hand__c,
    Establishment_Fee__c,
    Others__c,
    Legal_Cost__c,
    Discharge_Cost__c,
    Other_Sundries__c,
  ] = watch([
    'Purchase_Amount__c',
    'Loan_Sought__c',
    'Refinance_Amount__c',
    'FHOG__c',
    'LMI_To_be_paid__c',
    'LMI_To_be_Added__c',
    'Stamp_Duty_Transfer_of_Land__c',
    'Titles_Office_Mortgage__c',
    'Deposit_Paid__c',
    'Titles_Office_Transfer_of_Land__c',
    'Deposit_at_Hand__c',
    'Establishment_Fee__c',
    'Others__c',
    'Legal_Cost__c',
    'Discharge_Cost__c',
    'Other_Sundries__c',
  ]);

  const totalFundsAvailable =
    tranformToNumber(Loan_Sought__c) +
    tranformToNumber(FHOG__c) +
    tranformToNumber(Deposit_Paid__c) +
    tranformToNumber(Deposit_at_Hand__c) +
    tranformToNumber(Others__c) +
    tranformToNumber(LMI_To_be_Added__c);

  const totalFundsRequired =
    tranformToNumber(Purchase_Amount__c) +
    tranformToNumber(Refinance_Amount__c) +
    tranformToNumber(Stamp_Duty_Transfer_of_Land__c) +
    tranformToNumber(Titles_Office_Mortgage__c) +
    tranformToNumber(Titles_Office_Transfer_of_Land__c) +
    tranformToNumber(Establishment_Fee__c) +
    tranformToNumber(Legal_Cost__c) +
    tranformToNumber(Discharge_Cost__c) +
    tranformToNumber(LMI_To_be_paid__c) +
    tranformToNumber(Other_Sundries__c);

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
                    title="Funds to Compelete"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Purchase_Amount__c"
                      label="Purchase Amount"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Loan_Sought__c"
                      label="Loan Sought"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Refinance_Amount__c"
                      label="Refinance Amount"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="FHOG__c"
                      label="FHOG"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="LMI_To_be_paid__c"
                      label="LMI - To be paid"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="LMI_To_be_Added__c"
                      label="LMI - To be Added"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Stamp_Duty_Transfer_of_Land__c"
                      label="Stamp Duty - Transfer of Land"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Sales_Proceed_Gross__c"
                      label="Sales Proceed (Gross)"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Titles_Office_Mortgage__c"
                      label="Titles Office - Mortgage"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Deposit_Paid__c"
                      label="Deposit Paid"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Titles_Office_Transfer_of_Land__c"
                      label="Titles Office - Transfer of Land"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Deposit_at_Hand__c"
                      label="Deposit at Hand"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Establishment_Fee__c"
                      label="Establishment Fee"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Others__c"
                      label="Others"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Legal_Cost__c"
                      label="Legal Cost"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Discharge_Cost__c"
                      label="Discharge Cost"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Other_Sundries__c"
                      label="Other/Sundries"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <div />
                    <div className="flex justify-between text-lg">
                      <div>Total Funds Available:</div>
                      <div>{totalFundsAvailable.toFixed(2)}</div>
                    </div>
                    <div />
                    <div />
                    <div className="flex justify-between text-lg">
                      <div>Total Funds Required:</div>
                      <div>{totalFundsRequired.toFixed(2)}</div>
                    </div>
                    <div />
                    <div />
                    <div className="flex justify-between text-lg">
                      <div>Funds Surplus:</div>
                      <div>
                        {(totalFundsAvailable - totalFundsRequired).toFixed(2)}
                      </div>
                    </div>
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
