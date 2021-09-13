import { Tab } from '@headlessui/react';
import React from 'react';
import classNames from 'classnames';
import { EyeIcon, PhoneIcon } from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'react-query';
import { getLoanListService } from '@/services/loan';

const stages = [
  'All',
  'Open',
  'For Allocation',
  'Processing',
  'Approved Going Settlement',
  'Pending with Lender',
  'Closed',
];

export default function LoanList() {
  const user = useAuth();
  const accountId = user.user?.Account;
  const { data, isLoading } = useQuery(
    ['loanlist', accountId],
    () => getLoanListService(accountId!),
    {
      enabled: !!accountId,
    }
  );
  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <Tab.Group>
        <Tab.List className="flex p-2 space-x-1 bg-current/40 rounded-xl">
          {stages.map((stage) => (
            <Tab
              key={stage}
              className={({ selected }) =>
                classNames(
                  'w-full py-2 text-sm leading-5 font-bold text-current rounded-lg',
                  'focus:outline-none',
                  selected
                    ? 'bg-white shadow'
                    : 'text-current hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {stage}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 bg-current/40 rounded-xl p-2">
          {!isLoading ? (
            <>
              <Tab.Panel className="space-y-2">
                {data?.map((loan) => (
                  <LoanBrief key={loan.Id} data={loan} />
                ))}
              </Tab.Panel>
              <Tab.Panel>Content 1</Tab.Panel>
              <Tab.Panel>Content 2</Tab.Panel>
              <Tab.Panel>Content 3</Tab.Panel>
              <Tab.Panel>Content 4</Tab.Panel>
              <Tab.Panel>Content 5</Tab.Panel>
              <Tab.Panel>Content 6</Tab.Panel>
            </>
          ) : (
            'loading'
          )}
        </Tab.Panels>
      </Tab.Group>
      <div className="font-bold">此界面仅做参考</div>
    </div>
  );
}

interface LoanBriefProps {
  data: {
    Id: string;
    Name: string;
  };
}

function LoanBrief({ data }: LoanBriefProps) {
  const navigate = useNavigate();
  return (
    <div className="flex bg-white rounded-xl px-4">
      <div className="grow grid grid-cols-3">
        <div>Id: {data.Id}</div>
        <div>Name: {data.Name}</div>
        <div>Loan Amount: xxxx</div>
        <div>Broker: xxxx</div>
        <div>Loan Rate: xxxx</div>
        <div>Plan: xxxx</div>
      </div>
      <div className="flex justify-center items-center">
        <ul className="flex">
          <li>
            <EyeIcon
              onClick={() => navigate(data.Id)}
              className="w-5 h-5 cursor-pointer fill-blue-400"
            />
          </li>
          <li className="ml-2">
            <PhoneIcon className="w-5 h-5 cursor-pointer fill-green-500" />
          </li>
        </ul>
      </div>
    </div>
  );
}
