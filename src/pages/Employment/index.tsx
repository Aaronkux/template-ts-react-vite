import {
  EmploymentServiceData,
  createEmploymentService,
  CreateEmploymentServiceParams,
  getEmploymentService,
  updateEmploymentService,
  UpdateEmploymentServiceParams,
} from '@/services/employment';
import { Button, DatePicker, Input, message, Radio, Select } from 'antd';
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
import moment from 'moment-timezone';
import { countries, stateTranformed, streetType } from '@/utils/dataset';
import Loading from '@/components/Loading';

const totalPage = 1;

const { Option } = Select;

const schema = yup
  .object({
    A_Employer_Name__c: yup.string().nullable().required('Required'),
    A_Employment_Status__c: yup.string().nullable().required('Required'),
    A_Employment_Type__c: yup.string().nullable().required('Required'),
    Email__c: yup.string().email().nullable(),
  })
  .required();

const requirementPageFields = [
  'A_Applicant_Name__c',
  'A_Employer_Name__c',
  'A_Employment_Type__c',
  'A_Employment_Status__c',
  'A_Start_Date__c',
  'A_End_Date__c',
  'ABN_No__c',
  'ACN__c',
  'GST_registered__c',
  'share_of_ownership__c',
  'A_Primary_Employment__c',
  'A_Current_or_Previous__c',
  'Position__c',
  'Probation__c',
  'Company_Name__c',
  'Contact_Name__c',
  'A_State__c',
  'TPB_Registered__c',
  'Accountant_Phone_Number__c',
  'Fax_Number__c',
  'Email__c',
  'Company_Mailing_Address__c',
  'Contact_Person__c',
  'Phone_Number__c',
  'A_Unit_Number__c',
  'A_Floor_Number__c',
  'A_Street_Number__c',
  'A_Street_Name__c',
  'A_Street_Type__c',
  'A_Building_Name__c',
  'A_SuburbCity__c',
  'State__c',
  'A_Country__c',
  'A_Postcode__c',
];

export default function Employment() {
  const { employmentId, id } = useParams();
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

  const { isFetching } = useQuery<EmploymentServiceData, ErrorResponse>(
    ['employment', employmentId],
    () => getEmploymentService(employmentId!),
    {
      enabled: !!employmentId && employmentId !== 'new',
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
  const updateEmployment = useMutation<
    null,
    ErrorResponse,
    UpdateEmploymentServiceParams
  >('updateEmployment', updateEmploymentService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries(['employment', employmentId]);
      queryClient.invalidateQueries('loanlist');
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  // update data
  const createEmployment = useMutation<
    IdAndName,
    ErrorResponse,
    CreateEmploymentServiceParams
  >('createEmployment', createEmploymentService, {
    onSuccess: (data) => {
      message.success('Employment Created');
      queryClient.invalidateQueries('loanlist');
      navigate(`../employment/${data.Id}`, { replace: true });
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
    if (employmentId !== 'new') {
      updateEmployment.mutate({
        id: employmentId!,
        data: {
          ...submitData,
          Probation__c: submitData.Probation__c
            ? submitData.Probation__c
            : false,
        },
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
      createEmployment.mutate({
        ...submitData,
        A_Opportunity__c: id!,
        Fact_Find__c: factFindId!,
        Probation__c: submitData.Probation__c ? submitData.Probation__c : false,
      });
    }
  };
  const [A_Employment_Type__c] = watch(['A_Employment_Type__c']);

  useEffect(() => {
    if (employmentId === 'new') {
      requirementPageFields.forEach((field) => {
        setValue(field, null);
      });
    }
  }, [employmentId, setValue]);

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
                    title="Employment Details"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <div className="mb-3 text-red-500">
                    Please ensure your employment histories have covered 3 years
                    to qualify for any lender submission
                  </div>
                  <PageWrapper>
                    <FieldDecorator
                      name="A_Applicant_Name__c"
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
                      name="A_Employer_Name__c"
                      label="Employer Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Employment_Type__c"
                      label="Employment Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option value="Self Employed" key="Self Employed">
                          Self Employed
                        </Option>
                        <Option value="PAYG" key="PAYG">
                          PAYG
                        </Option>
                        <Option value="Unemployed" key="Unemployed">
                          Unemployed
                        </Option>
                        <Option value="Retired" key="Retired">
                          Retired
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Employment_Status__c"
                      label="Employment Status"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option value="Full Time" key="Full Time">
                          Full Time
                        </Option>
                        <Option value="Part Time" key="Part Time">
                          Part Time
                        </Option>
                        <Option value="Contract" key="Contract">
                          Contract
                        </Option>
                        <Option value="Temporary" key="Temporary">
                          Temporary
                        </Option>
                        <Option value="Commission" key="Commission">
                          Commission
                        </Option>
                        <Option value="Seasonal" key="Seasonal">
                          Seasonal
                        </Option>
                        <Option value="Casual" key="Casual">
                          Casual
                        </Option>
                        <Option value="Self Employed" key="Self Employed">
                          Self Employed
                        </Option>
                        <Option value="Unemployed" key="Unemployed">
                          Unemployed
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Start_Date__c"
                      label="Start Date"
                      transformIn={(value) => (value ? moment(value) : null)}
                      transformOut={(value) =>
                        value ? value.format('YYYY-MM-DD') : null
                      }
                      control={control}
                      setValue={setValue}
                    >
                      <DatePicker placeholder="" />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_End_Date__c"
                      label="End Date"
                      transformIn={(value) => (value ? moment(value) : null)}
                      transformOut={(value) =>
                        value ? value.format('YYYY-MM-DD') : null
                      }
                      control={control}
                      setValue={setValue}
                    >
                      <DatePicker placeholder="" />
                    </FieldDecorator>
                    <div />
                    <FieldDecorator
                      name="ABN_No__c"
                      label="ABN No."
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                      hiddenWhenInvisible
                      setNullCondition={
                        A_Employment_Type__c !== 'PAYG' &&
                        A_Employment_Type__c !== 'Self Employed'
                      }
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="ACN__c"
                      label="ACN"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                      hiddenWhenInvisible
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="GST_registered__c"
                      label="GST registered?"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                      hiddenWhenInvisible
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      name="share_of_ownership__c"
                      label="Share of ownership"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                      hiddenWhenInvisible
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Primary_Employment__c"
                      label="Primary Employment"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                      hiddenWhenInvisible
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Current_or_Previous__c"
                      label="Current or Previous"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                      hiddenWhenInvisible
                    >
                      <Select allowClear>
                        <Option value="Current" key="Current">
                          Current
                        </Option>
                        <Option value="Previous" key="Previous">
                          Previous
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Position__c"
                      label="Position"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                      hiddenWhenInvisible
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Probation__c"
                      label="Probation"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                      hiddenWhenInvisible
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                  </PageWrapper>
                  {A_Employment_Type__c === 'Self Employed' && (
                    <ContentTitle title="Accountant Details" hiddenPage />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      name="Company_Name__c"
                      label="Company Name"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Contact_Name__c"
                      label="Contact Name"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_State__c"
                      label="State"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                    >
                      <Select
                        allowClear
                        showSearch
                        optionFilterProp={'children'}
                      >
                        {Object.entries(stateTranformed).map(
                          ([value, name]) => (
                            <Option key={value} value={value}>
                              {name}
                            </Option>
                          )
                        )}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="TPB_Registered__c"
                      label="TPB Registered?"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Accountant_Phone_Number__c"
                      label="Phone Number"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Fax_Number__c"
                      label="Fax Number"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Email__c"
                      label="Email"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Company_Mailing_Address__c"
                      label="Company Mailing Address"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'Self Employed'}
                    >
                      <Input />
                    </FieldDecorator>
                  </PageWrapper>
                  {A_Employment_Type__c === 'PAYG' && (
                    <ContentTitle title="Employer Details" hiddenPage />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      name="ABN_No__c"
                      label="ABN No."
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                      setNullCondition={
                        A_Employment_Type__c !== 'PAYG' &&
                        A_Employment_Type__c !== 'Self Employed'
                      }
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Contact_Person__c"
                      label="Contact Person"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="Phone_Number__c"
                      label="Phone Number"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Unit_Number__c"
                      label="Unit Number"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Floor_Number__c"
                      label="Floor Number"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Street_Number__c"
                      label="Street Number"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Street_Name__c"
                      label="Street Name"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Street_Type__c"
                      label="Street Type"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Select allowClear showSearch>
                        {streetType.map((name) => (
                          <Option key={name} value={name}>
                            {name}
                          </Option>
                        ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Building_Name__c"
                      label="Building Name"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_SuburbCity__c"
                      label="Suburb/City"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="State__c"
                      label="State"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Country__c"
                      label="Country"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
                    >
                      <Select allowClear showSearch>
                        {countries.map((country) => (
                          <Option key={country} value={country}>
                            {country}
                          </Option>
                        ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Postcode__c"
                      label="Postcode"
                      control={control}
                      setValue={setValue}
                      visible={A_Employment_Type__c === 'PAYG'}
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
            {updateEmployment.isLoading ? (
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
