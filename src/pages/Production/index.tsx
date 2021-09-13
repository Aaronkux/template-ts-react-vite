import {
  ProductionServiceData,
  createProductionService,
  CreateProductionServiceParams,
  getProductionService,
  updateProductionService,
  UpdateProductionServiceParams,
} from '@/services/production';
import { Button, Checkbox, Input, message, Radio, Select } from 'antd';
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
import Loading from '@/components/Loading';

const totalPage = 1;

const { Option } = Select;

const schema = yup
  .object({
    Rate_Lock__c: yup
      .string()
      .nullable()
      .when('Product_Type__c', {
        is: (val?: string) => val?.includes('Fixed'),
        then: yup.string().nullable().required('Required'),
      }),
  })
  .required();

const requirementPageFields = [
  'Product_Type__c',
  'Rate_Lock__c',
  'Repayment_Type__c',
  'IO_Term__c',
  'Reason_for_IO__c',
  'Loan_Purposes__c',
  'Intent__c',
  'Other_Intent__c',
  'LMI_Premium__c',
  'LMI_Options__c',
  'Loan_Amount__c',
  'Loan_Term__c',
  'Interest_Rate_Approved__c',
  'Repayment_Amount__c',
  'Features__c',
];
const featureOptions = [
  'Offset',
  'Redraw',
  'Internet & Online Banking',
  'Line of Credit',
  'Low Doc',
  'Access to Loan via ATM',
];

export default function Production() {
  const { productionId, id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const factFindId = params.get('factFindId');
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { control, handleSubmit, reset, watch, trigger, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { isFetching } = useQuery<ProductionServiceData, ErrorResponse>(
    ['production', productionId],
    () => getProductionService(productionId!),
    {
      enabled: !!productionId && productionId !== 'new',
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
  const updateProduction = useMutation<
    null,
    ErrorResponse,
    UpdateProductionServiceParams
  >('updateProduction', updateProductionService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries(['production', productionId]);
      queryClient.invalidateQueries('loanlist');
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  // update data
  const createProduction = useMutation<
    IdAndName,
    ErrorResponse,
    CreateProductionServiceParams
  >('createProduction', createProductionService, {
    onSuccess: (data) => {
      message.success('Production Created');
      queryClient.invalidateQueries('loanlist');
      navigate(`../production/${data.Id}`, { replace: true });
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
    if (productionId !== 'new') {
      updateProduction.mutate({
        id: productionId!,
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
      createProduction.mutate({
        Security__c: id!,
        Fact_Find__c: factFindId!,
        ...submitData,
      });
    }
  };

  useEffect(() => {
    if (productionId === 'new') {
      requirementPageFields.forEach((field) => {
        setValue(field, null);
      });
    }
  }, [productionId, setValue]);

  const [Product_Type__c, Repayment_Type__c, Intent__c] = watch([
    'Product_Type__c',
    'Repayment_Type__c',
    'Intent__c',
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
                    title="Loan Details"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Product_Type__c"
                      label="Product Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          value="Standard Variable"
                          key="Standard Variable"
                        >
                          Standard Variable
                        </Option>
                        <Option value="Basic Variable" key="Basic Variable">
                          Basic Variable
                        </Option>
                        <Option value="1 Year Fixed" key="1 Year Fixed">
                          1 Year Fixed
                        </Option>
                        <Option value="2 Year Fixed" key="2 Year Fixed">
                          2 Year Fixed
                        </Option>
                        <Option value="3 Year Fixed" key="3 Year Fixed">
                          3 Year Fixed
                        </Option>
                        <Option value="4 Year Fixed" key="4 Year Fixed">
                          4 Year Fixed
                        </Option>
                        <Option value="5 Year Fixed" key="5 Year Fixed">
                          5 Year Fixed
                        </Option>
                        <Option
                          value="Standard Variable - Low Doc"
                          key="Standard Variable - Low Doc"
                        >
                          Standard Variable - Low Doc
                        </Option>
                        <Option
                          value="1 Year Fixed - Low Doc"
                          key="1 Year Fixed - Low Doc"
                        >
                          1 Year Fixed - Low Doc
                        </Option>
                        <Option
                          value="2 Year Fixed - Low Doc"
                          key="2 Year Fixed - Low Doc"
                        >
                          2 Year Fixed - Low Doc
                        </Option>
                        <Option
                          value="3 Year Fixed - Low Doc"
                          key="3 Year Fixed - Low Doc"
                        >
                          3 Year Fixed - Low Doc
                        </Option>
                        <Option
                          value="4 Year Fixed - Low Doc"
                          key="4 Year Fixed - Low Doc"
                        >
                          4 Year Fixed - Low Doc
                        </Option>
                        <Option
                          value="5 Year Fixed - Low Doc"
                          key="5 Year Fixed - Low Doc"
                        >
                          5 Year Fixed - Low Doc
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Rate_Lock__c"
                      label="Rate Locked"
                      control={control}
                      setValue={setValue}
                      visible={!!Product_Type__c?.includes('Fixed')}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <div />
                    <FieldDecorator
                      name="Repayment_Type__c"
                      label="Repayment Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          value="Principal and Interest"
                          key="Principal and Interest"
                        >
                          Principal and Interest
                        </Option>
                        <Option value="Interest Only" key="Interest Only">
                          Interest Only
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="IO_Term__c"
                      label="IO Term"
                      control={control}
                      setValue={setValue}
                      visible={Repayment_Type__c === 'Interest Only'}
                    >
                      <Select allowClear>
                        <Option value="1 Year" key="1 Year">
                          1 Year
                        </Option>
                        <Option value="2 Years" key="2 Years">
                          2 Years
                        </Option>
                        <Option value="3 Years" key="3 Years">
                          3 Years
                        </Option>
                        <Option value="4 Years" key="4 Years">
                          4 Years
                        </Option>
                        <Option value="5 Years" key="5 Years">
                          5 Years
                        </Option>
                        <Option value="10 Years" key="10 Years">
                          10 Years
                        </Option>
                        <Option value="15 Years" key="15 Years">
                          15 Years
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Reason_for_IO__c"
                      label="Reason for IO"
                      control={control}
                      setValue={setValue}
                      visible={Repayment_Type__c === 'Interest Only'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Loan_Purposes__c"
                      label="Primary Purpose"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option value="Owner Occupied" key="Owner Occupied">
                          Owner Occupied
                        </Option>
                        <Option value="Investment" key="Investment">
                          Investment
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Intent__c"
                      label="Intent"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option value="Purchase" key="Purchase">
                          Purchase
                        </Option>
                        <Option value="Refinance" key="Refinance">
                          Refinance
                        </Option>
                        <Option
                          value="Land &/or Construction"
                          key="Land &/or Construction"
                        >
                          Land &/or Construction
                        </Option>
                        <Option value="Renovation" key="Renovation">
                          Renovation
                        </Option>
                        <Option value="Investment" key="Investment">
                          Investment
                        </Option>
                        <Option
                          value="Debt Consolidation"
                          key="Debt Consolidation"
                        >
                          Debt Consolidation
                        </Option>
                        <Option value="Vehicle Purchase" key="Vehicle Purchase">
                          Vehicle Purchase
                        </Option>
                        <Option value="Equity Release" key="Equity Release">
                          Equity Release
                        </Option>
                        <Option value="Top Up" key="Top Up">
                          Top Up
                        </Option>
                        <Option value="Other" key="Other">
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Other_Intent__c"
                      label="Other Intent"
                      control={control}
                      setValue={setValue}
                      visible={Intent__c === 'Other'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="LMI_Premium__c"
                      label="LMI Premium"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="LMI_Options__c"
                      label="LMI Options"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          value="To be Paid by Client"
                          key="To be Paid by Client"
                        >
                          To be Paid by Client
                        </Option>
                        <Option
                          value="To be added to Loan Amount"
                          key="To be added to Loan Amount"
                        >
                          To be added to Loan Amount
                        </Option>
                        <Option
                          value="To be Paid by Lender"
                          key="To be Paid by Lender"
                        >
                          To be Paid by Lender
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <div />
                    <FieldDecorator
                      name="Loan_Amount__c"
                      label="Base Loan Amount"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Loan_Term__c"
                      label="Loan Term (yrs)"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Interest_Rate_Approved__c"
                      label="Interest Rate"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Repayment_Amount__c"
                      label="Monthly Repayment"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <div />
                    <div />
                    <FieldDecorator
                      className="col-span-3"
                      name="Features__c"
                      label="Features"
                      control={control}
                      setValue={setValue}
                      transformIn={(value) => value?.split(';')}
                      transformOut={(value) => value?.join(';') ?? null}
                    >
                      <Checkbox.Group options={featureOptions} />
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
            {updateProduction.isLoading ? (
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
