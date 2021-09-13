import {
  LivingServiceData,
  createLivingService,
  CreateLivingServiceParams,
  getLivingService,
  updateLivingService,
  UpdateLivingServiceParams,
} from '@/services/living';
import { Button, DatePicker, Input, message, Select } from 'antd';
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
    A_Account__c: yup.string().nullable().required('Required'),
  })
  .required();

const requirementPageFields = [
  'A_Account__c',
  'A_Housing_Situation__c',
  'A_From_Date__c',
  'A_To_Date__c',
  'A_Type_Of_Address__c',
  'A_Address_Type__c',
  'Address_Type_Mercury__c',
  'A_Building_Name__c',
  'A_Unit_Number__c',
  'A_Street_number__c',
  'A_Street__c',
  'A_Street_Type__c',
  'A_City__c',
  'A_State__c',
  'A_Country__c',
  'A_Postcode__c',
];

export default function Living() {
  const { livingId, id } = useParams();
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

  const { isFetching } = useQuery<LivingServiceData, ErrorResponse>(
    ['living', livingId],
    () => getLivingService(livingId!),
    {
      enabled: !!livingId && livingId !== 'new',
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
  const updateLiving = useMutation<
    null,
    ErrorResponse,
    UpdateLivingServiceParams
  >('updateLiving', updateLivingService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries(['living', livingId]);
      queryClient.invalidateQueries('loanlist');
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  // update data
  const createLiving = useMutation<
    IdAndName,
    ErrorResponse,
    CreateLivingServiceParams
  >('createLiving', createLivingService, {
    onSuccess: (data) => {
      message.success('Living Created');
      queryClient.invalidateQueries('loanlist');
      navigate(`../living/${data.Id}`, { replace: true });
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
    if (livingId !== 'new') {
      updateLiving.mutate({
        id: livingId!,
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
      createLiving.mutate({
        ...submitData,
        A_Loan_Application__c: id!,
        Fact_Find__c: factFindId!,
      });
    }
  };

  useEffect(() => {
    if (livingId === 'new') {
      requirementPageFields.forEach((field) => {
        setValue(field, null);
      });
    }
  }, [livingId, setValue]);

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
                    title="Living Details"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <div className="mb-3 text-red-500">
                    Please ensure your living histories have covered 3 years to
                    qualify for any lender submission
                  </div>
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
                    <FieldDecorator
                      name="A_Housing_Situation__c"
                      label="Housing Situation"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option index="Own Home" value="Own Home">
                          Own Home
                        </Option>
                        <Option
                          index="Own Home With Mortgage"
                          value="Own Home With Mortgage"
                        >
                          Own Home With Mortgage
                        </Option>
                        <Option index="Renting" value="Renting">
                          Renting
                        </Option>
                        <Option
                          index="Living With Parents"
                          value="Living With Parents"
                        >
                          Living With Parents
                        </Option>
                        <Option index="Boarding" value="Boarding">
                          Boarding
                        </Option>
                        <Option index="Caravan" value="Caravan">
                          Caravan
                        </Option>
                        <Option index="Other" value="Other">
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_From_Date__c"
                      label="From Date"
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
                      name="A_To_Date__c"
                      label="To Date"
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
                      name="A_Type_Of_Address__c"
                      label="Type of Address"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option index="Previous" value="Previous">
                          Previous
                        </Option>
                        <Option index="Mailing Address" value="Mailing Address">
                          Mailing Address
                        </Option>
                        <Option index="Post Settlement" value="Post Settlement">
                          Post Settlement
                        </Option>
                        <Option index="Current" value="Current">
                          Current
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Address_Type__c"
                      label="Address Format"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option index="Standard" value="Standard">
                          Standard
                        </Option>
                        <Option index="Non-Standard" value="Non-Standard">
                          Non-Standard
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Address_Type_Mercury__c"
                      label="Address Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option index="Business" value="Business">
                          Business
                        </Option>
                        <Option index="Employer" value="Employer">
                          Employer
                        </Option>
                        <Option index="Future Address" value="Future Address">
                          Future Address
                        </Option>
                        <Option index="Home" value="Home">
                          Home
                        </Option>
                        <Option
                          index="Investment Property"
                          value="Investment Property"
                        >
                          Investment Property
                        </Option>
                        <Option index="PO Box" value="PO Box">
                          PO Box
                        </Option>
                        <Option index="Previous" value="Previous">
                          Previous
                        </Option>
                        <Option
                          index="Previous Employer"
                          value="Previous Employer"
                        >
                          Previous Employer
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Building_Name__c"
                      label="Building Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      name="A_Unit_Number__c"
                      label="Unit Number"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Street_number__c"
                      label="Street Number"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Street__c"
                      label="Street"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Street_Type__c"
                      label="Street Type"
                      control={control}
                      setValue={setValue}
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
                      name="A_City__c"
                      label="City"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_State__c"
                      label="State"
                      control={control}
                      setValue={setValue}
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
                      name="A_Country__c"
                      label="Country"
                      control={control}
                      setValue={setValue}
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
            {updateLiving.isLoading ? (
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
