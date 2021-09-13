import ContentTitle from '@/components/ContentTitle';
import Loading from '@/components/Loading';
import PageWrapper from '@/components/PageWrapper';
import {
  FactFindServiceData,
  getFactFindService,
  updateFactFindService,
  UpdateFactFindServiceParams,
} from '@/services/factfind';
import { ErrorResponse } from '@/services/global';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Radio, Rate, Select } from 'antd';
import classnames from 'classnames';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

const totalPage = 2;

const { Option } = Select;

export default function NeedsAndObjectives() {
  const { factFindId } = useParams();
  const queryClient = useQueryClient();

  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [allValues, setAllValues] = useState<any>({});
  // visible control
  // Purpose_of_proposed_loan__c
  const [refinanceVisible, setRefinanceVisible] = useState(false);
  const [otherPurposeVisible, setOtherPurposeVisible] = useState(false);
  const [lenderVisible, setLenderVisible] = useState(false);
  const [referralVisible, setReferralVisible] = useState(false);
  const [otherVisible, setOtherVisible] = useState(false);
  const [pageTwo1Visible, setPageTwo1Visible] = useState(false);
  const [pageTwo2Visible, setPageTwo2Visible] = useState(false);
  const [pageTwo3Visible, setPageTwo3Visible] = useState(false);
  const [pageTwo4Visible, setPageTwo4Visible] = useState(false);
  const [pageTwo5Visible, setPageTwo5Visible] = useState(false);
  const [pageTwo6Visible, setPageTwo6Visible] = useState(false);
  const [pageTwo7Visible, setPageTwo7Visible] = useState(false);
  const [pageTwo8Visible, setPageTwo8Visible] = useState(false);
  const [pageTwo9Visible, setPageTwo9Visible] = useState(false);
  const [pageTwo10Visible, setPageTwo10Visible] = useState(false);

  // query data
  const { data, isFetching } = useQuery<FactFindServiceData, ErrorResponse>(
    'factFind',
    () => getFactFindService(factFindId!),
    {
      enabled: !!factFindId,
      onSettled: (res) => {
        setRefinanceVisible(
          res?.Purpose_of_proposed_loan__c === 'Refinance' ?? false
        );
        setOtherPurposeVisible(
          res?.Purpose_of_proposed_loan__c === 'Other Purpose' ?? false
        );
        setLenderVisible(res?.Lender_Conflict_of_Interest__c ?? false);
        setReferralVisible(res?.Referral_conflict_of_interest__c ?? false);
        setOtherVisible(res?.Other_conflict_of_interest__c ?? false);
        setPageTwo1Visible(
          res?.Have_insurance_to_meet_commitments__c === 'No' ?? false
        );
        setPageTwo2Visible(
          res?.Concerned_interest_rate_fluctuation__c === 'Yes' ?? false
        );
        setPageTwo3Visible(
          res?.Concerned_about_your_job_security__c === 'Yes' ?? false
        );
        setPageTwo4Visible(
          res?.Concerned_negative_property_equity__c === 'Yes' ?? false
        );
        setPageTwo5Visible(
          res?.Expect_significant_changes_to_financial__c === 'Yes' ?? false
        );
        setPageTwo6Visible(
          res?.Able_to_pay_in_event_of_loss_of_income__c === 'Yes' ?? false
        );
        setPageTwo7Visible(res?.Able_to_maintai__c === 'Yes' ?? false);
        setPageTwo8Visible(
          res?.Preference_for_type_of_lender__c === 'Yes' ?? false
        );
        setPageTwo9Visible(
          res?.Prefer_lenders_offer_shorter_decisioning__c === 'Yes' ?? false
        );
        setPageTwo10Visible(
          res?.Retire_before_end_of_loan_term__c === 'Yes' ?? false
        );
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

  const onFormSubmit = () => {
    if (!updateFactFind.isLoading) {
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
    const allKeys = Object.keys(changedValues);
    const {
      Purpose_of_proposed_loan__c,
      Lender_Conflict_of_Interest__c,
      Referral_conflict_of_interest__c,
      Other_conflict_of_interest__c,
      Have_insurance_to_meet_commitments__c,
      Concerned_interest_rate_fluctuation__c,
      Concerned_about_your_job_security__c,
      Concerned_negative_property_equity__c,
      Expect_significant_changes_to_financial__c,
      Able_to_pay_in_event_of_loss_of_income__c,
      Able_to_maintai__c,
      Preference_for_type_of_lender__c,
      Prefer_lenders_offer_shorter_decisioning__c,
      Retire_before_end_of_loan_term__c,
    } = changedValues;
    // Purpose of proposed loan
    if (allKeys.includes('Purpose_of_proposed_loan__c')) {
      if (Purpose_of_proposed_loan__c === 'Refinance') {
        setRefinanceVisible(true);
        otherPurposeVisible && setOtherPurposeVisible(false);
        form.setFieldsValue({
          Please_provide_details_of_your_benefits__c: null,
        });
      } else if (Purpose_of_proposed_loan__c === 'Other Purpose') {
        setOtherPurposeVisible(true);
        refinanceVisible && setRefinanceVisible(false);
        form.setFieldsValue({
          Your_financial_benefit_to_refinance__c: null,
        });
      } else {
        setRefinanceVisible(false);
        setOtherPurposeVisible(false);
        form.setFieldsValue({
          Please_provide_details_of_your_benefits__c: null,
          Your_financial_benefit_to_refinance__c: null,
        });
      }
    }

    if (allKeys.includes('Lender_Conflict_of_Interest__c')) {
      if (Lender_Conflict_of_Interest__c === true) {
        setLenderVisible(true);
      } else {
        setLenderVisible(false);
        form.setFieldsValue({
          Please_state_details_lender__c: null,
        });
      }
    }
    if (allKeys.includes('Referral_conflict_of_interest__c')) {
      if (Referral_conflict_of_interest__c === true) {
        setReferralVisible(true);
      } else {
        setReferralVisible(false);
        form.setFieldsValue({
          Please_state_details_referral__c: null,
        });
      }
    }
    if (allKeys.includes('Other_conflict_of_interest__c')) {
      if (Other_conflict_of_interest__c === true) {
        setOtherVisible(true);
      } else {
        setOtherVisible(false);
        form.setFieldsValue({
          Please_state_details_other__c: null,
        });
      }
    }
    if (allKeys.includes('Have_insurance_to_meet_commitments__c')) {
      if (Have_insurance_to_meet_commitments__c === 'No') {
        setPageTwo1Visible(true);
      } else {
        setPageTwo1Visible(false);
        form.setFieldsValue({
          Please_provide_explanation_insurance__c: null,
        });
      }
    }
    if (allKeys.includes('Concerned_interest_rate_fluctuation__c')) {
      if (Concerned_interest_rate_fluctuation__c === 'Yes') {
        setPageTwo2Visible(true);
      } else {
        setPageTwo2Visible(false);
        form.setFieldsValue({
          Please_provide_explanation_fluctuation__c: null,
        });
      }
    }
    if (allKeys.includes('Concerned_about_your_job_security__c')) {
      if (Concerned_about_your_job_security__c === 'Yes') {
        setPageTwo3Visible(true);
      } else {
        setPageTwo3Visible(false);
        form.setFieldsValue({
          Please_provide_explanation_security__c: null,
        });
      }
    }
    if (allKeys.includes('Concerned_negative_property_equity__c')) {
      if (Concerned_negative_property_equity__c === 'Yes') {
        setPageTwo4Visible(true);
      } else {
        setPageTwo4Visible(false);
        form.setFieldsValue({
          Please_provide_explanation_negative__c: null,
        });
      }
    }
    if (allKeys.includes('Expect_significant_changes_to_financial__c')) {
      if (Expect_significant_changes_to_financial__c === 'Yes') {
        setPageTwo5Visible(true);
      } else {
        setPageTwo5Visible(false);
        form.setFieldsValue({
          Please_provide_explanation_changes__c: null,
        });
      }
    }
    if (allKeys.includes('Able_to_pay_in_event_of_loss_of_income__c')) {
      if (Able_to_pay_in_event_of_loss_of_income__c === 'Yes') {
        setPageTwo6Visible(true);
      } else {
        setPageTwo6Visible(false);
        form.setFieldsValue({
          Please_provide_explanation_loss__c: null,
        });
      }
    }
    if (allKeys.includes('Able_to_maintai__c')) {
      if (Able_to_maintai__c === 'Yes') {
        setPageTwo7Visible(true);
      } else {
        setPageTwo7Visible(false);
        form.setFieldsValue({
          Please_provide_explanation_illness__c: null,
        });
      }
    }
    if (allKeys.includes('Preference_for_type_of_lender__c')) {
      if (Preference_for_type_of_lender__c === 'Yes') {
        setPageTwo8Visible(true);
      } else {
        setPageTwo8Visible(false);
        form.setFieldsValue({
          Please_provide_lender_name__c: null,
        });
      }
    }
    if (allKeys.includes('Prefer_lenders_offer_shorter_decisioning__c')) {
      if (Prefer_lenders_offer_shorter_decisioning__c === 'Yes') {
        setPageTwo9Visible(true);
      } else {
        setPageTwo9Visible(false);
        form.setFieldsValue({
          Please_provide_explanation_decisioning__c: null,
        });
      }
    }
    if (allKeys.includes('Retire_before_end_of_loan_term__c')) {
      if (Retire_before_end_of_loan_term__c === 'Yes') {
        setPageTwo10Visible(true);
      } else {
        setPageTwo10Visible(false);
        form.setFieldsValue({
          Exit_Strategy_for_remaining_term__c: null,
        });
      }
    }
  };

  const onFinish = (values: any) => {
    const finalValues = { ...allValues, ...values };
    Object.keys(finalValues).forEach((key) => {
      if (finalValues[key] === undefined) {
        finalValues[key] = null;
      }
    });
    updateFactFind.mutate({
      id: factFindId!,
      data: finalValues,
    });
  };

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
                    title="Objectives"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <Form.Item
                      label="Primary reasons for seeking credit"
                      name="Reasons_for_seeking_financial_advice__c"
                      initialValue={
                        data?.Reasons_for_seeking_financial_advice__c
                      }
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Short Term (1-5 yrs)"
                      name="Short_Term_1_5_yrs__c"
                      initialValue={data?.Short_Term_1_5_yrs__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Medium Term (6-15 yrs)"
                      name="Medium_Term_6_15_yrs__c"
                      initialValue={data?.Medium_Term_6_15_yrs__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Long Term (16 - 30 yrs)"
                      name="Long_Term_16_30_yrs__c"
                      initialValue={data?.Long_Term_16_30_yrs__c}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Interview and key outcome notes"
                      name="Exit_Strategy__c"
                      initialValue={data?.Exit_Strategy__c}
                    >
                      <Input />
                    </Form.Item>
                    <div />
                  </PageWrapper>
                  <ContentTitle title="Loan Purpose" hiddenPage />
                  <PageWrapper>
                    <Form.Item
                      label="Loan Purpose Type"
                      name="Loan_Purpose_Type__c"
                      initialValue={data?.Loan_Purpose_Type__c}
                    >
                      <Select allowClear>
                        <Option key="Owner Occupied" value={'Owner Occupied'}>
                          Owner Occupied
                        </Option>
                        <Option key="Investment" value={'Investment'}>
                          Investment
                        </Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Purpose of proposed loan"
                      name="Purpose_of_proposed_loan__c"
                      initialValue={data?.Purpose_of_proposed_loan__c}
                    >
                      <Select allowClear>
                        <Option key="Purchase" value={'Purchase'}>
                          Purchase
                        </Option>
                        <Option key="Construction" value={'Construction'}>
                          Construction
                        </Option>
                        <Option key="Renovation" value={'Renovation'}>
                          Renovation
                        </Option>
                        <Option key="Investment" value={'Investment'}>
                          Investment
                        </Option>
                        <Option
                          key="Vehicle Purchase"
                          value={'Vehicle Purchase'}
                        >
                          Vehicle Purchase
                        </Option>
                        <Option key="Refinance" value={'Refinance'}>
                          Refinance
                        </Option>
                        <Option
                          key="Debt Consolidation"
                          value={'Debt Consolidation'}
                        >
                          Debt Consolidation
                        </Option>
                        <Option key="Other Purpose" value={'Other Purpose'}>
                          Other Purpose
                        </Option>
                      </Select>
                    </Form.Item>
                    {refinanceVisible && (
                      <Form.Item
                        label="Financial benefits of refinance"
                        name="Your_financial_benefit_to_refinance__c"
                        initialValue={
                          data?.Your_financial_benefit_to_refinance__c
                        }
                      >
                        <Input />
                      </Form.Item>
                    )}
                    {otherPurposeVisible && (
                      <Form.Item
                        label="Please provide detail explanation"
                        name="Please_provide_details_of_your_benefits__c"
                        initialValue={
                          data?.Please_provide_details_of_your_benefits__c
                        }
                      >
                        <Input />
                      </Form.Item>
                    )}
                  </PageWrapper>
                  <ContentTitle
                    title="Conflict of Interest Disclosure"
                    hiddenPage
                  />
                  <PageWrapper>
                    <Form.Item
                      label="Conflict of interest identified"
                      name="Conflict_of_interest_identified__c"
                      initialValue={data?.Conflict_of_interest_identified__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <div />
                    <div />
                    <Form.Item
                      label="Lender conflict of interest"
                      name="Lender_Conflict_of_Interest__c"
                      initialValue={data?.Lender_Conflict_of_Interest__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {lenderVisible ? (
                      <Form.Item
                        label="Please state details"
                        name="Please_state_details_lender__c"
                        initialValue={data?.Please_state_details_lender__c}
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Referral conflict of interest"
                      name="Referral_conflict_of_interest__c"
                      initialValue={data?.Referral_conflict_of_interest__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {referralVisible ? (
                      <Form.Item
                        label="Please state details"
                        name="Please_state_details_referral__c"
                        initialValue={data?.Please_state_details_referral__c}
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Other conflict of interest"
                      name="Other_conflict_of_interest__c"
                      initialValue={data?.Other_conflict_of_interest__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {otherVisible ? (
                      <Form.Item
                        label="Please state details"
                        name="Please_state_details_other__c"
                        initialValue={data?.Please_state_details_other__c}
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                  </PageWrapper>
                </>
              )}
              {currentPage === 2 && (
                <>
                  <ContentTitle
                    title="Protecting Financial Securities"
                    currentPage={currentPage}
                    totalPages={totalPage}
                  />
                  <PageWrapper>
                    <Form.Item
                      label="Are You A Smoker?"
                      name="Are_you_a_smoker__c"
                      initialValue={data?.Are_you_a_smoker__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <div />
                    <div />
                    <Form.Item
                      label="Do you have a current will in place?"
                      name="Do_you_have_a_current_will_in_place__c"
                      initialValue={
                        data?.Do_you_have_a_current_will_in_place__c
                      }
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <div />
                    <div />
                    <Form.Item
                      label="Have insurance to meet commitments?"
                      name="Have_insurance_to_meet_commitments__c"
                      initialValue={data?.Have_insurance_to_meet_commitments__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo1Visible ? (
                      <Form.Item
                        label="Interested in being referred to an agent?"
                        name="Please_provide_explanation_insurance__c"
                        initialValue={
                          data?.Please_provide_explanation_insurance__c
                        }
                      >
                        <Radio.Group buttonStyle="solid">
                          <Radio value={'Yes'}>Yes</Radio>
                          <Radio value={'No'}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Concerned interest rate fluctuation?"
                      name="Concerned_interest_rate_fluctuation__c"
                      initialValue={
                        data?.Concerned_interest_rate_fluctuation__c
                      }
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo2Visible ? (
                      <Form.Item
                        label="Rating"
                        name="Please_provide_explanation_fluctuation__c"
                        initialValue={parseInt(
                          data?.Please_provide_explanation_fluctuation__c ??
                            '0',
                          10
                        )}
                      >
                        <Rate count={10} className="text-current" />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Concerned about your job security?"
                      name="Concerned_about_your_job_security__c"
                      initialValue={data?.Concerned_about_your_job_security__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo3Visible ? (
                      <Form.Item
                        label="Rating"
                        name="Please_provide_explanation_security__c"
                        initialValue={parseInt(
                          data?.Please_provide_explanation_security__c ?? '0',
                          10
                        )}
                      >
                        <Rate count={10} className="text-current" />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Concerned negative property equity?"
                      name="Concerned_negative_property_equity__c"
                      initialValue={data?.Concerned_negative_property_equity__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo4Visible ? (
                      <Form.Item
                        label="Rating"
                        name="Please_provide_explanation_negative__c"
                        initialValue={parseInt(
                          data?.Please_provide_explanation_negative__c ?? '0',
                          10
                        )}
                      >
                        <Rate count={10} className="text-current" />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Expect significant changes to financial?"
                      name="Expect_significant_changes_to_financial__c"
                      initialValue={
                        data?.Expect_significant_changes_to_financial__c
                      }
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo5Visible ? (
                      <Form.Item
                        label="Please provide explanation"
                        name="Please_provide_explanation_changes__c"
                        initialValue={
                          data?.Please_provide_explanation_changes__c
                        }
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Able to pay in event of loss of income?"
                      name="Able_to_pay_in_event_of_loss_of_income__c"
                      initialValue={
                        data?.Able_to_pay_in_event_of_loss_of_income__c
                      }
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo6Visible ? (
                      <Form.Item
                        label="Please provide explanation"
                        name="Please_provide_explanation_loss__c"
                        initialValue={data?.Please_provide_explanation_loss__c}
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Able to maintain in event of illness?"
                      name="Able_to_maintai__c"
                      initialValue={data?.Able_to_maintai__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo7Visible ? (
                      <Form.Item
                        label="Please provide explanation"
                        name="Please_provide_explanation_illness__c"
                        initialValue={
                          data?.Please_provide_explanation_illness__c
                        }
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Preference for type of lender?"
                      name="Preference_for_type_of_lender__c"
                      initialValue={data?.Preference_for_type_of_lender__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo8Visible ? (
                      <Form.Item
                        label="Please provide lender name"
                        name="Please_provide_lender_name__c"
                        initialValue={data?.Please_provide_lender_name__c}
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Prefer lenders with shorter SLA?"
                      name="Prefer_lenders_offer_shorter_decisioning__c"
                      initialValue={
                        data?.Prefer_lenders_offer_shorter_decisioning__c
                      }
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo9Visible ? (
                      <Form.Item
                        label="Please provide detail explanation"
                        name="Please_provide_explanation_decisioning__c"
                        initialValue={
                          data?.Please_provide_explanation_decisioning__c
                        }
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
                    <div />
                    <Form.Item
                      label="Retire before end of loan term?"
                      name="Retire_before_end_of_loan_term__c"
                      initialValue={data?.Retire_before_end_of_loan_term__c}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio value={'Yes'}>Yes</Radio>
                        <Radio value={'No'}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {pageTwo10Visible ? (
                      <Form.Item
                        label="Exit Strategy"
                        name="Exit_Strategy_for_remaining_term__c"
                        initialValue={data?.Exit_Strategy_for_remaining_term__c}
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <div />
                    )}
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
