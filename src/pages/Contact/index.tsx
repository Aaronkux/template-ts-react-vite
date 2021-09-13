import ContentTitle from '@/components/ContentTitle';
import { Button, Form, Input, Select, Radio, DatePicker, message } from 'antd';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { LoadingOutlined } from '@ant-design/icons';
import { countries } from '@/utils/dataset';
import PageWrapper from '@/components/PageWrapper';
import { useParams } from 'react-router-dom';
import {
  ContactServiceData,
  getContactService,
  updateContactService,
  UpdateContactServiceParams,
} from '@/services/contact';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import moment from 'moment-timezone';
import { ErrorResponse } from '@/services/global';
import Loading from '@/components/Loading';

const { Option } = Select;
const totalPage = 2;

export default function Contact() {
  const params = useParams();
  const contactId = params?.contactId;
  const queryClient = useQueryClient();

  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [allValues, setAllValues] = useState<any>({});
  // visible control
  const [companyVisible, setCompanyVisible] = useState(false);

  // query data
  const { data, isFetching } = useQuery<ContactServiceData, ErrorResponse>(
    ['contact', contactId],
    () => getContactService(contactId!),
    {
      enabled: !!contactId,
      onSettled: () => {
        form.resetFields();
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );

  // update data
  const updateContact = useMutation<
    null,
    ErrorResponse,
    UpdateContactServiceParams
  >('updateContact', updateContactService, {
    onSuccess: () => {
      message.success('Update Successfully');
      queryClient.invalidateQueries(['contact', contactId]);
      queryClient.invalidateQueries('loanlist');
      setCurrentPage(1);
    },
    onError: (error) => {
      message.error(error.errorMsg);
    },
  });

  const onFormSubmit = () => {
    if (!updateContact.isLoading) {
      form.submit();
    }
  };

  const onFormNext = () => {
    form
      .validateFields()
      .then((values) => {
        const currentPageValues = values;
        setAllValues({ ...allValues, ...currentPageValues });
        setCurrentPage(currentPage + 1);
      })
      .catch(() => {
        message.error('Please Check The Form');
      });
  };

  const onFormChange = (changedValues: any) => {
    const { A_Entity_Type__c } = changedValues;
    // Entity Type Change
    if (A_Entity_Type__c) {
      if (A_Entity_Type__c === 'Company') {
        setCompanyVisible(true);
      } else if (A_Entity_Type__c !== 'Company') {
        form.setFieldsValue({
          Company__c: null,
          A_ABN__c: null,
          Company_Type__c: null,
        });
        setCompanyVisible(false);
      }
    }
  };

  const onFinish = (values: any) => {
    const finalValues = { ...allValues, ...values };
    const {
      DOB__c,
      Expiry__c,
      Passport_Expiry_Date__c,
      Passport_Issued_Date__c,
      Photo_Card_Expiry_Date__c,
      Medicare_Expiry_Date__c,
    } = finalValues;
    const newValues = {
      ...finalValues,
      DOB__c: DOB__c ? moment(DOB__c).format('YYYY-MM-DD') : null,
      Expiry__c: Expiry__c ? moment(Expiry__c).format('YYYY-MM-DD') : null,
      Passport_Expiry_Date__c: Passport_Expiry_Date__c
        ? moment(Passport_Expiry_Date__c).format('YYYY-MM-DD')
        : null,
      Passport_Issued_Date__c: Passport_Issued_Date__c
        ? moment(Passport_Issued_Date__c).format('YYYY-MM-DD')
        : null,
      Photo_Card_Expiry_Date__c: Photo_Card_Expiry_Date__c
        ? moment(Photo_Card_Expiry_Date__c).format('YYYY-MM-DD')
        : null,
      Medicare_Expiry_Date__c: Medicare_Expiry_Date__c
        ? moment(Medicare_Expiry_Date__c).format('YYYY-MM-DD')
        : null,
    };
    Object.keys(newValues).forEach((key) => {
      if (newValues[key] === undefined) {
        newValues[key] = null;
      }
    });
    updateContact.mutate({
      id: contactId!,
      data: newValues,
    });
  };

  useEffect(() => {
    if (contactId) {
      setAllValues({});
      setCurrentPage(1);
    }
  }, [contactId]);

  return !isFetching ? (
    <div className="font-semibold h-full overflow-y-auto flex flex-col">
      <Form
        form={form}
        layout="vertical"
        className="overflow-x-hidden px-10 pt-6 grow"
        onFinish={onFinish}
        onValuesChange={onFormChange}
      >
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
                // row 1
                <>
                  <ContentTitle
                    title="Personal Details"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <Form.Item
                      label="Entity Type"
                      name="A_Entity_Type__c"
                      initialValue={data?.A_Entity_Type__c}
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Please Select Entity Type',
                        },
                      ]}
                    >
                      <Select allowClear>
                        <Option key="Company" value={'Company'}>
                          Company
                        </Option>
                        <Option key="Trustee" value={'Trustee'}>
                          Trustee
                        </Option>
                        <Option key="Individual" value={'Individual'}>
                          Individual
                        </Option>
                        <Option key="Guarantor" value={'Guarantor'}>
                          Guarantor
                        </Option>
                      </Select>
                    </Form.Item>
                    <div />
                    <div />
                    {/* row 2 */}
                    {companyVisible && (
                      <>
                        <Form.Item
                          label="Company"
                          name="Company__c"
                          initialValue={data?.Company__c}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="ABN"
                          name="A_ABN__c"
                          initialValue={data?.A_ABN__c}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          label="Company Type"
                          name="Company_Type__c"
                          initialValue={data?.Company_Type__c}
                        >
                          <Select allowClear>
                            <Option key="Incorporated" value={'Incorporated'}>
                              Incorporated
                            </Option>
                            <Option key="Limited" value={'Limited'}>
                              Limited
                            </Option>
                            <Option key="No Liability" value={'No Liability'}>
                              No Liability
                            </Option>
                            <Option
                              key="Proprietary Limited"
                              value={'Proprietary Limited'}
                            >
                              Proprietary Limited
                            </Option>
                            <Option
                              key="Unlimited Proprietary"
                              value={'Unlimited Proprietary'}
                            >
                              Unlimited Proprietary
                            </Option>
                          </Select>
                        </Form.Item>
                      </>
                    )}
                    {/* row 3 */}
                    <Form.Item
                      label="First Name"
                      name="FirstName"
                      initialValue={data?.FirstName}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Middle Name"
                      name="MiddleName"
                      initialValue={data?.MiddleName}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Last Name"
                      name="LastName"
                      initialValue={data?.LastName}
                    >
                      <Input />
                    </Form.Item>
                    {/* row 4 */}
                    <Form.Item
                      label="Preferred Name"
                      name="Preferred_Name__c"
                      initialValue={data?.Preferred_Name__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Gender"
                      name="Gender__c"
                      initialValue={data?.Gender__c}
                    >
                      <Select allowClear>
                        <Option key="Male" value={'Male'}>
                          Male
                        </Option>
                        <Option key="Female" value={'Female'}>
                          Female
                        </Option>
                        <Option key="Unknown" value={'Unknown'}>
                          Unknown
                        </Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Marital Status"
                      name="A_Marital_Status__c"
                      initialValue={data?.A_Marital_Status__c}
                    >
                      <Select allowClear>
                        <Option key="DeFacto" value={'DeFacto'}>
                          DeFacto
                        </Option>
                        <Option key="Divorced" value={'Divorced'}>
                          Divorced
                        </Option>
                        <Option key="Married" value={'Married'}>
                          Married
                        </Option>
                        <Option key="Other" value={'Other'}>
                          Other
                        </Option>
                        <Option key="Separated" value={'Separated'}>
                          Separated
                        </Option>
                        <Option key="Single" value={'Single'}>
                          Single
                        </Option>
                        <Option key="Widowed" value={'Widowed'}>
                          Widowed
                        </Option>
                      </Select>
                    </Form.Item>
                    {/* row 5 */}
                    <Form.Item
                      label="Date of Birth"
                      name="DOB__c"
                      initialValue={data?.DOB__c ? moment(data?.DOB__c) : null}
                    >
                      <DatePicker placeholder="" />
                    </Form.Item>
                    <Form.Item
                      label="Referral conflict of interest"
                      name="Receive_Birthday_Emails__c"
                      initialValue={data?.Receive_Birthday_Emails__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      label="Mobile"
                      name="PersonMobilePhone"
                      initialValue={data?.PersonMobilePhone}
                    >
                      <Input />
                    </Form.Item>
                    {/* row 6 */}
                    <Form.Item
                      label="Email"
                      name="PersonEmail"
                      initialValue={data?.PersonEmail}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Country of Residency"
                      name="Country_of_Residency__c"
                      initialValue={data?.Country_of_Residency__c}
                    >
                      <Select allowClear showSearch>
                        {countries.map((country) => (
                          <Option key={country} value={country}>
                            {country}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Residency Status"
                      name="Residency_Status__c"
                      initialValue={data?.Residency_Status__c}
                    >
                      <Select allowClear>
                        <Option key="Citizen" value={'Citizen'}>
                          Citizen
                        </Option>
                        <Option
                          key="Permanent Resident"
                          value={'Permanent Resident'}
                        >
                          Permanent Resident
                        </Option>
                        <Option
                          key="Temporary Resident"
                          value={'Temporary Resident'}
                        >
                          Temporary Resident
                        </Option>
                        <Option key="Non Resident" value={'Non Resident'}>
                          Non Resident
                        </Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Visa"
                      name="Visa__c"
                      initialValue={data?.Visa__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Full name of spouse"
                      name="Full_name_of_spouse__c"
                      initialValue={data?.Full_name_of_spouse__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Number of Dependents"
                      name="A_Number_of_Dependents__c"
                      initialValue={data?.A_Number_of_Dependents__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Dependent Ages"
                      name="Dependent_Ages__c"
                      initialValue={data?.Dependent_Ages__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Mother's maiden name(Citi/ING/AAA)"
                      name="Mother_s_maiden_name_Citi_ING_AAA__c"
                      initialValue={data?.Mother_s_maiden_name_Citi_ING_AAA__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Relative or Close Friend Name"
                      name="Relative_or_Close_Friend_Name__c"
                      initialValue={data?.Relative_or_Close_Friend_Name__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Relative or Close Friend relationship"
                      name="Relative_or_Close_Friend_relationship__c"
                      initialValue={
                        data?.Relative_or_Close_Friend_relationship__c
                      }
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Relative or Close Friend Contact"
                      name="Relative_or_Close_Friend_Contact__c"
                      initialValue={data?.Relative_or_Close_Friend_Contact__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Relative or Close Friend Address"
                      name="Relative_or_Close_Friend_Address__c"
                      initialValue={data?.Relative_or_Close_Friend_Address__c}
                    >
                      <Input />
                    </Form.Item>
                  </PageWrapper>
                </>
              )}
              {currentPage === 2 && (
                <>
                  <ContentTitle
                    title="Driver License"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <Form.Item
                      label="DL Number"
                      name="Number__c"
                      initialValue={data?.Number__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="DL State Issued"
                      name="State__c"
                      initialValue={data?.State__c}
                    >
                      <Select allowClear showSearch>
                        <Option key="NSW" value={'NSW'}>
                          NSW
                        </Option>
                        <Option key="VIC" value={'VIC'}>
                          VIC
                        </Option>
                        <Option key="QLD" value={'QLD'}>
                          QLD
                        </Option>
                        <Option key="NT" value={'NT'}>
                          NT
                        </Option>
                        <Option key="TAS" value={'TAS'}>
                          TAS
                        </Option>
                        <Option key="WA" value={'WA'}>
                          WA
                        </Option>
                        <Option key="SA" value={'SA'}>
                          SA
                        </Option>
                        <Option key="ACT" value={'ACT'}>
                          ACT
                        </Option>
                        <Option key="OTHER" value={'OTHER'}>
                          OTHER
                        </Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="DL Expiration Date"
                      name="Expiry__c"
                      initialValue={
                        data?.Expiry__c ? moment(data?.Expiry__c) : null
                      }
                    >
                      <DatePicker placeholder="" />
                    </Form.Item>

                    <Form.Item
                      label="License Class"
                      name="License_Class__c"
                      initialValue={data?.License_Class__c}
                    >
                      <Input />
                    </Form.Item>
                    <div />
                    <div />
                  </PageWrapper>
                  <ContentTitle title="Passport" hiddenPage />
                  <PageWrapper>
                    <Form.Item
                      label="Passport No."
                      name="Passport_No__c"
                      initialValue={data?.Passport_No__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Place of Issue"
                      name="Place_of_Issue__c"
                      initialValue={data?.Place_of_Issue__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Passport Expiry Date"
                      name="Passport_Expiry_Date__c"
                      initialValue={
                        data?.Passport_Expiry_Date__c
                          ? moment(data?.Passport_Expiry_Date__c)
                          : null
                      }
                    >
                      <DatePicker placeholder="" />
                    </Form.Item>

                    <Form.Item
                      label="Passport Issued Date"
                      name="Passport_Issued_Date__c"
                      initialValue={
                        data?.Passport_Issued_Date__c
                          ? moment(data?.Passport_Issued_Date__c)
                          : null
                      }
                    >
                      <DatePicker placeholder="" />
                    </Form.Item>
                    <div />
                    <div />
                  </PageWrapper>
                  <ContentTitle title="Photo Card" hiddenPage />
                  <PageWrapper>
                    <Form.Item
                      label="Photo Card Number"
                      name="Photo_Card_Number__c"
                      initialValue={data?.Photo_Card_Number__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Photo Card Expiry Date"
                      name="Photo_Card_Expiry_Date__c"
                      initialValue={
                        data?.Photo_Card_Expiry_Date__c
                          ? moment(data?.Photo_Card_Expiry_Date__c)
                          : null
                      }
                    >
                      <DatePicker placeholder="" />
                    </Form.Item>
                    <div />
                  </PageWrapper>
                  <ContentTitle title="Medicare Card" hiddenPage />
                  <PageWrapper>
                    <Form.Item
                      label="Medicare Card Number"
                      name="Medicare_Card_Number__c"
                      initialValue={data?.Medicare_Card_Number__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Medicare Expiry Date"
                      name="Medicare_Expiry_Date__c"
                      initialValue={
                        data?.Medicare_Expiry_Date__c
                          ? moment(data?.Medicare_Expiry_Date__c)
                          : null
                      }
                    >
                      <DatePicker placeholder="" />
                    </Form.Item>
                    <div />
                  </PageWrapper>
                </>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </Form>
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
            onClick={onFormSubmit}
            style={{ width: '86px' }}
          >
            {updateContact.isLoading ? (
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
