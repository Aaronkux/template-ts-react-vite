import {
  AssetsServiceData,
  createAssetsService,
  CreateAssetsServiceParams,
  getAssetsService,
  updateAssetsService,
  UpdateAssetsServiceParams,
} from '@/services/assets';
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  message,
  Radio,
  Select,
} from 'antd';
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
import { countries, state, stateTranformed, streetType } from '@/utils/dataset';
import moment from 'moment-timezone';
import { getLoanListService } from '@/services/loan';
import { getBankService } from '@/services/bank';
import Loading from '@/components/Loading';

const totalPage = 2;

const { Option } = Select;

const schema = yup
  .object({
    Name: yup.string().nullable().required('Name is required'),
    A_Asset_Type__c: yup.string().nullable().required('Asset Type is required'),
    Email__c: yup.string().email().nullable(),
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
  'Name',
  'A_Asset_Type__c',
  'A_Description__c',
  'Value_Basis__c',
  'Currency__c',
  'A_Asset_Amount__c',
  'Ownership1__c',
  'Ownership2__c',
  'Ownership3__c',
  'Ownership4__c',
  'Percentage1__c',
  'Percentage2__c',
  'Percentage3__c',
  'Percentage4__c',
  'A_Primary_Purpose__c',
  'Intent__c',
  'A_Zoning__c',
  'Security_Type__c',
  'A_Use_as_security__c',
  'A_Property_is_being_purchased__c',
  'A_Address_Type__c',
  'A_Type_of_Address__c',
  'A_Building_Name__c',
  'unit_number__c',
  'floor_number__c',
  'street_number__c',
  'street__c',
  'street_type__c',
  'city__c',
  'state__c',
  'postcode__c',
  'country__c',
  'A_Monthly_Rental_Income__c',
  'Contact_Name_for_Valuer_Access__c',
  'Contact_number_for_valuer_access__c',
  'Company_Type__c',
  'Company_Name__c',
  'Company_ABN__c',
  'Contact_Name__c',
  'Phone_Number__c',
  'Fax_Number__c',
  'Email__c',
  'Company_Mailing_Address__c',
  'Website__c',
  'State_Sol__c',
  'Postcode_Sol__c',
  'A_Financial_Institution__c',
  'A_Other_Institution__c',
  'A_Account_Type__c',
  'A_Account_Name__c',
  'A_Bsb__c',
  'A_Account_Number__c',
  'Motor_Type__c',
  'A_Vehicle_Year__c',
  'A_Vehicle_Make__c',
  'Vehicle_Model__c',
  'A_Purchase_Date__c',
];

export default function Assets() {
  const { assetId, id } = useParams();
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

  const { isFetching } = useQuery<AssetsServiceData, ErrorResponse>(
    ['assets', assetId],
    () => getAssetsService(assetId!),
    {
      enabled: !!assetId && assetId !== 'new',
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
  const updateAssets = useMutation<
    null,
    ErrorResponse,
    UpdateAssetsServiceParams
  >('updateAssets', updateAssetsService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries(['assets', assetId]);
      queryClient.invalidateQueries('loanlist');
      setCurrentPage(1);
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  // update data
  const createAssets = useMutation<
    IdAndName,
    ErrorResponse,
    CreateAssetsServiceParams
  >('createAssets', createAssetsService, {
    onSuccess: (data) => {
      message.success('Asset Created');
      queryClient.invalidateQueries('loanlist');
      setCurrentPage(1);
      navigate(`../assets/${data.Id}`, { replace: true });
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  const { data: bankData, isLoading: bankLoading } = useQuery(
    'bank',
    () => getBankService(),
    {
      onError: (err: ErrorResponse) => {
        message.error(err.errorMsg);
      },
    }
  );

  const onFormNext = async () => {
    const validateRes = await trigger();
    if (validateRes) setCurrentPage(currentPage + 1);
  };

  const onFinish = (submitData: any) => {
    if (assetId !== 'new') {
      updateAssets.mutate({
        id: assetId!,
        data: submitData,
      });
    } else {
      if (!id) {
        message.error(`Loan Id can't be empty`);
        return;
      } else if (!user?.Account) {
        message.error(`User Account can't be empty`);
        return;
      } else if (!factFindId) {
        message.error(`FactFind Id can't be empty`);
        return;
      }
      createAssets.mutate({
        A_Loan_Application__c: id!,
        A_Account__c: user?.Account,
        Fact_Find__c: factFindId!,
        ...submitData,
      });
    }
  };

  useEffect(() => {
    if (assetId === 'new') {
      requirementPageFields.forEach((field) => {
        setValue(field, null);
      });
    }
  }, [assetId, setValue]);

  const [A_Asset_Type__c, A_Property_is_being_purchased__c] = watch([
    'A_Asset_Type__c',
    'A_Property_is_being_purchased__c',
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
                    title="Asset Details"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Name"
                      label="Asset Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Asset_Type__c"
                      label="Asset Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="Real Estate" value={'Real Estate'}>
                          Real Estate
                        </Option>
                        <Option key="Deposit Account" value={'Deposit Account'}>
                          Deposit Account
                        </Option>
                        <Option key="Boat" value={'Boat'}>
                          Boat
                        </Option>
                        <Option
                          key="Charge over cash"
                          value={'Charge over cash'}
                        >
                          Charge over cash
                        </Option>
                        <Option key="Collections" value={'Collections'}>
                          Collections
                        </Option>
                        <Option
                          key="Debenture Charge"
                          value={'Debenture Charge'}
                        >
                          Debenture Charge
                        </Option>
                        <Option
                          key="Goodwill of Business"
                          value={'Goodwill of Business'}
                        >
                          Goodwill of Business
                        </Option>
                        <Option key="Guarantee" value={'Guarantee'}>
                          Guarantee
                        </Option>
                        <Option key="Home Contents" value={'Home Contents'}>
                          Home Contents
                        </Option>
                        <Option key="Life Insurance" value={'Life Insurance'}>
                          Life Insurance
                        </Option>
                        <Option key="Managed Fund" value={'Managed Fund'}>
                          Managed Fund
                        </Option>
                        <Option key="Motor Vehicle" value={'Motor Vehicle'}>
                          Motor Vehicle
                        </Option>
                        <Option
                          key="Personal Equity in any Private Business"
                          value={'Personal Equity in any Private Business'}
                        >
                          Personal Equity in any Private Business
                        </Option>
                        <Option key="Receivables" value={'Receivables'}>
                          Receivables
                        </Option>
                        <Option key="Shares" value={'Shares'}>
                          Shares
                        </Option>
                        <Option
                          key="Stock & Machinery"
                          value={'Stock & Machinery'}
                        >
                          Stock & Machinery
                        </Option>
                        <Option key="Superannuation" value={'Superannuation'}>
                          Superannuation
                        </Option>
                        <Option key="Tools of Trade" value={'Tools of Trade'}>
                          Tools of Trade
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Description__c"
                      label="Description"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      name="Value_Basis__c"
                      label="Value Basis"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key="Applicant Estimate"
                          value={'Applicant Estimate'}
                        >
                          Applicant Estimate
                        </Option>
                        <Option
                          key="Certified Valuation"
                          value={'Certified Valuation'}
                        >
                          Certified Valuation
                        </Option>
                        <Option key="Actual Value" value={'Actual Value'}>
                          Actual Value
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Currency__c"
                      label="Currency"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="AUD" value={'AUD'}>
                          AUD
                        </Option>
                        <Option key="CNY" value={'CNY'}>
                          CNY
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="A_Asset_Amount__c"
                      label="Asset Value"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                  </PageWrapper>

                  {A_Asset_Type__c === 'Real Estate' && (
                    <ContentTitle
                      title="Real Estate Asset Details"
                      hiddenPage
                    />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="A_Primary_Purpose__c"
                      label="Primary Purpose"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="Owner Occupied" value={'Owner Occupied'}>
                          Owner Occupied
                        </Option>
                        <Option key="Investment" value={'Investment'}>
                          Investment
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Intent__c"
                      label="Intent"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="Purchase" value={'Purchase'}>
                          Purchase
                        </Option>
                        <Option key="Refinance" value={'Refinance'}>
                          Refinance
                        </Option>
                        <Option
                          key="Land &/or Construction"
                          value={'Land &/or Construction'}
                        >
                          Land &/or Construction
                        </Option>
                        <Option key="Top Up" value={'Top Up'}>
                          Top Up
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="A_Zoning__c"
                      label="Zoning"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="Residential" value={'Residential'}>
                          Residential
                        </Option>
                        <Option key="Commercial" value={'Commercial'}>
                          Commercial
                        </Option>
                        <Option key="Industrial" value={'Industrial'}>
                          Industrial
                        </Option>
                        <Option key="Rural" value={'Rural'}>
                          Rural
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Security_Type__c"
                      label="Security Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="Apartment" value={'Apartment'}>
                          Apartment
                        </Option>
                        <Option key="House" value={'House'}>
                          House
                        </Option>
                        <Option key="Land" value={'Land'}>
                          Land
                        </Option>
                        <Option key="Build" value={'Build'}>
                          Build
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="A_Use_as_security__c"
                      label="Use as security?"
                      control={control}
                      setValue={setValue}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="A_Property_is_being_purchased__c"
                      label="Property is being purchased"
                      control={control}
                      setValue={setValue}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={
                        A_Asset_Type__c === 'Real Estate' &&
                        A_Property_is_being_purchased__c === 'Yes'
                      }
                      name="A_Purchase_Date__c"
                      label="Purchase Date"
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
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="A_Address_Type__c"
                      label="Address Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="Standard" value={'Standard'}>
                          Standard
                        </Option>
                        <Option key="Non-Standard" value={'Non-Standard'}>
                          Non-Standard
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="A_Type_of_Address__c"
                      label="Type of Address"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key="Previous" value={'Previous'}>
                          Previous
                        </Option>
                        <Option key="Mailing Address" value={'Mailing Address'}>
                          Mailing Address
                        </Option>
                        <Option key="Post Settlement" value={'Post Settlement'}>
                          Post Settlement
                        </Option>
                        <Option key="Current" value={'Current'}>
                          Current
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="A_Building_Name__c"
                      label="Building Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="unit_number__c"
                      label="Unit Number"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="floor_number__c"
                      label="Floor Number"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="street_number__c"
                      label="Street Number"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="street__c"
                      label="Street"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="street_type__c"
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
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="city__c"
                      label="City"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="state__c"
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
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="postcode__c"
                      label="Postcode"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="country__c"
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
                    <div />
                    <div />
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="A_Monthly_Rental_Income__c"
                      label="Monthly Rental Income"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Contact_Name_for_Valuer_Access__c"
                      label="Contact Name For Valuer Access"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Contact_number_for_valuer_access__c"
                      label="Contact Number For Valuer Access"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                  </PageWrapper>

                  {A_Asset_Type__c === 'Real Estate' && (
                    <ContentTitle
                      title="Solicitor/Conveyancer Details"
                      hiddenPage
                    />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Company_Type__c"
                      label="Company Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key={'Solicitor'} value={'Solicitor'}>
                          {'Solicitor'}
                        </Option>
                        <Option key={'Conveyancer'} value={'Conveyancer'}>
                          {'Conveyancer'}
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Company_Name__c"
                      label="Company Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Company_ABN__c"
                      label="Company ABN"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Contact_Name__c"
                      label="Contact Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Phone_Number__c"
                      label="Phone Number"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Fax_Number__c"
                      label="Fax Number"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Email__c"
                      label="Email"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Company_Mailing_Address__c"
                      label="Company Mailing Address"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Website__c"
                      label="Website"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="State_Sol__c"
                      label="State"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear showSearch>
                        {state.map((item) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Real Estate'}
                      name="Postcode_Sol__c"
                      label="Postcode"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                  </PageWrapper>
                </>
              )}
              {A_Asset_Type__c === 'Deposit Account' && (
                <>
                  <ContentTitle title="Deposit Account Details" hiddenPage />
                  <PageWrapper>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Deposit Account'}
                      name="A_Financial_Institution__c"
                      label="Lender"
                      control={control}
                      setValue={setValue}
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
                      visible={A_Asset_Type__c === 'Deposit Account'}
                      name="A_Other_Institution__c"
                      label="Other Institution"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Deposit Account'}
                      name="A_Account_Type__c"
                      label="Account Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option
                          key={'Cash Management'}
                          value={'Cash Management'}
                        >
                          {'Cash Management'}
                        </Option>
                        <Option key={'Cheque Account'} value={'Cheque Account'}>
                          {'Cheque Account'}
                        </Option>
                        <Option
                          key={'Investment Savings'}
                          value={'Investment Savings'}
                        >
                          {'Investment Savings'}
                        </Option>
                        <Option
                          key={'Pension Account'}
                          value={'Pension Account'}
                        >
                          {'Pension Account'}
                        </Option>
                        <Option
                          key={'Savings Account'}
                          value={'Savings Account'}
                        >
                          {'Savings Account'}
                        </Option>
                        <Option key={'Term Deposit'} value={'Term Deposit'}>
                          {'Term Deposit'}
                        </Option>
                        <Option key={'Other Deposit'} value={'Other Deposit'}>
                          {'Other Deposit'}
                        </Option>
                      </Select>
                    </FieldDecorator>

                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Deposit Account'}
                      name="A_Account_Name__c"
                      label="Account Name"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Deposit Account'}
                      name="A_Bsb__c"
                      label="BSB"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Deposit Account'}
                      name="A_Account_Number__c"
                      label="Account Number"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>
                  </PageWrapper>
                  {A_Asset_Type__c === 'Motor Vehicle' && (
                    <ContentTitle title="Motor Vehicle Details" hiddenPage />
                  )}
                  <PageWrapper>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Motor Vehicle'}
                      name="Motor_Type__c"
                      label="Motor Type"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear>
                        <Option key={'Bike'} value={'Bike'}>
                          Bike
                        </Option>
                        <Option key={'Large'} value={'Large'}>
                          Large
                        </Option>
                        <Option key={'Luxury Car'} value={'Luxury Car'}>
                          Luxury Car
                        </Option>
                        <Option key={'4WD'} value={'4WD'}>
                          4WD
                        </Option>
                        <Option key={'Medium'} value={'Medium'}>
                          Medium
                        </Option>
                        <Option key={'Small'} value={'Small'}>
                          Small
                        </Option>
                        <Option key={'Small Medium'} value={'Small Medium'}>
                          Small Medium
                        </Option>
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Motor Vehicle'}
                      name="A_Vehicle_Year__c"
                      label="Vehicle Year"
                      control={control}
                      setValue={setValue}
                    >
                      <Input type={'number'} />
                    </FieldDecorator>
                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Motor Vehicle'}
                      name="A_Vehicle_Make__c"
                      label="Vehicle Make"
                      control={control}
                      setValue={setValue}
                    >
                      <Input />
                    </FieldDecorator>

                    <FieldDecorator
                      visible={A_Asset_Type__c === 'Motor Vehicle'}
                      name="Vehicle_Model__c"
                      label="Vehicle Model"
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
                    title="Ownership"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <FieldDecorator
                      name="Ownership1__c"
                      label="Ownership1"
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
                      name="Percentage1__c"
                      label="Percentage1"
                      control={control}
                      setValue={setValue}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(value) => (value ? `${value}%` : '')}
                        parser={(value): any => value?.replace('%', '')}
                      />
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      name="Ownership2__c"
                      label="Ownership2"
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
                      name="Percentage2__c"
                      label="Percentage2"
                      control={control}
                      setValue={setValue}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(value) => (value ? `${value}%` : '')}
                        parser={(value): any => value?.replace('%', '')}
                      />
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      name="Ownership3__c"
                      label="Ownership3"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear loading={loanListLoading}>
                        {loanListData
                          ?.find((item) => item.Id === id)
                          ?.Contact?.map((item) => (
                            <Option key={item.Name} value={item.Name}>
                              {item.Name}
                            </Option>
                          ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Percentage3__c"
                      label="Percentage3"
                      control={control}
                      setValue={setValue}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(value) => (value ? `${value}%` : '')}
                        parser={(value): any => value?.replace('%', '')}
                      />
                    </FieldDecorator>
                    <div />

                    <FieldDecorator
                      name="Ownership4__c"
                      label="Ownership4"
                      control={control}
                      setValue={setValue}
                    >
                      <Select allowClear loading={loanListLoading}>
                        {loanListData
                          ?.find((item) => item.Id === id)
                          ?.Contact?.map((item) => (
                            <Option key={item.Name} value={item.Name}>
                              {item.Name}
                            </Option>
                          ))}
                      </Select>
                    </FieldDecorator>
                    <FieldDecorator
                      name="Percentage4__c"
                      label="Percentage4"
                      control={control}
                      setValue={setValue}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(value) => (value ? `${value}%` : '')}
                        parser={(value): any => value?.replace('%', '')}
                      />
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
            {updateAssets.isLoading ? (
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
