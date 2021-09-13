import { DropDown } from '@/components/DropDown';
import Loading from '@/components/Loading';
import { useAuth } from '@/hooks/useAuth';
import { deleteAssetsService } from '@/services/assets';
import { deleteCreditService } from '@/services/credit';
import { deleteEmploymentService } from '@/services/employment';
import { deleteExpenseService } from '@/services/expense';
import { ErrorResponse } from '@/services/global';
import { deleteIncomeService } from '@/services/income';
import { deleteLiabilityService } from '@/services/liability';
import { deleteLivingService } from '@/services/living';
import { getLoanListService } from '@/services/loan';
import { deleteProductionService } from '@/services/production';
import {
  ArrowCircleLeftIcon,
  CalculatorIcon,
  ChartBarIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  CurrencyDollarIcon,
  DocumentReportIcon,
  DocumentTextIcon,
  HomeIcon,
  IdentificationIcon,
  NewspaperIcon,
  ShoppingCartIcon,
  SupportIcon,
  UsersIcon,
  MinusCircleIcon,
} from '@heroicons/react/solid';
import { message, Modal } from 'antd';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';

export default function OpportunityLayout() {
  const { id } = useParams();
  const user = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const accountId = user.user?.Account;
  const { data, isLoading } = useQuery(
    'loanlist',
    () => getLoanListService(accountId!),
    {
      enabled: !!accountId,
    }
  );

  const deleteAssets = useMutation<null, ErrorResponse, string>(
    'deleteAssets',
    deleteAssetsService,
    {
      onSuccess: () => {
        message.success('Asset Deleted');
        queryClient.invalidateQueries('loanlist');
        navigate(`/loans/${id}`, { replace: true });
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );

  const onAssetDelete = (e: Event, assetId: string) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Do you Want to delete this asset?',
      onOk() {
        deleteAssets.mutate(assetId);
      },
    });
  };

  const deleteLiability = useMutation<null, ErrorResponse, string>(
    'deleteLiability',
    deleteLiabilityService,
    {
      onSuccess: () => {
        message.success('Liability Deleted');
        queryClient.invalidateQueries('loanlist');
        navigate(`/loans/${id}`, { replace: true });
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );
  const onLiabilityDelete = (e: Event, liabilityId: string) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Do you Want to delete this liability?',
      onOk() {
        deleteLiability.mutate(liabilityId);
      },
    });
  };
  const deleteProduction = useMutation<null, ErrorResponse, string>(
    'deleteProduction',
    deleteProductionService,
    {
      onSuccess: () => {
        message.success('Production Deleted');
        queryClient.invalidateQueries('loanlist');
        navigate(`/loans/${id}`, { replace: true });
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );

  const onProductionDelete = (e: Event, productionId: string) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Do you Want to delete this production?',
      onOk() {
        deleteProduction.mutate(productionId);
      },
    });
  };

  const deleteExpense = useMutation<null, ErrorResponse, string>(
    'deleteExpense',
    deleteExpenseService,
    {
      onSuccess: () => {
        message.success('Expense Deleted');
        queryClient.invalidateQueries('loanlist');
        navigate(`/loans/${id}`, { replace: true });
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );

  const onExpenseDelete = (e: Event, expenseId: string) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Do you Want to delete this expense?',
      onOk() {
        deleteExpense.mutate(expenseId);
      },
    });
  };

  const deleteEmployment = useMutation<null, ErrorResponse, string>(
    'deleteEmployment',
    deleteEmploymentService,
    {
      onSuccess: () => {
        message.success('Employment Deleted');
        queryClient.invalidateQueries('loanlist');
        navigate(`/loans/${id}`, { replace: true });
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );

  const onEmploymentDelete = (e: Event, employmentId: string) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Do you Want to delete this employment?',
      onOk() {
        deleteEmployment.mutate(employmentId);
      },
    });
  };

  const deleteIncome = useMutation<null, ErrorResponse, string>(
    'deleteIncome',
    deleteIncomeService,
    {
      onSuccess: () => {
        message.success('Income Deleted');
        queryClient.invalidateQueries('loanlist');
        navigate(`/loans/${id}`, { replace: true });
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );

  const onIncomeDelete = (e: Event, incomeId: string) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Do you Want to delete this income?',
      onOk() {
        deleteIncome.mutate(incomeId);
      },
    });
  };

  const deleteCredit = useMutation<null, ErrorResponse, string>(
    'deleteCredit',
    deleteCreditService,
    {
      onSuccess: () => {
        message.success('Credit Deleted');
        queryClient.invalidateQueries('loanlist');
        navigate(`/loans/${id}`, { replace: true });
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );

  const onCreditDelete = (e: Event, creditId: string) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Do you Want to delete this credit?',
      onOk() {
        deleteCredit.mutate(creditId);
      },
    });
  };

  const deleteLiving = useMutation<null, ErrorResponse, string>(
    'deleteLiving',
    deleteLivingService,
    {
      onSuccess: () => {
        message.success('Living Deleted');
        queryClient.invalidateQueries('loanlist');
        navigate(`/loans/${id}`, { replace: true });
      },
      onError: (error) => {
        message.error(error.errorMsg);
      },
    }
  );

  const onLivingDelete = (e: Event, livingId: string) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Do you Want to delete this living?',
      onOk() {
        deleteLiving.mutate(livingId);
      },
    });
  };

  return (
    <div className="flex grow min-w-[1400px] overflow-hidden">
      {/* left side menu */}
      <div
        style={{ boxShadow: '3px 0 3px -2px rgba(0,0,0,0.1)' }}
        className="flex flex-col basis-64"
      >
        {!isLoading ? (
          <nav className="overflow-y-auto grow mt-4">
            <div className="space-y-2">
              <NavItem
                title="Back to loans"
                to={`/loans`}
                icon={<ArrowCircleLeftIcon className="h-6 w-6" />}
              />
              <NavItem
                title="Overview"
                to={`/loans/${id}`}
                icon={<ClipboardCheckIcon className="h-6 w-6" />}
              />
              <DropDown
                activePath="/loans/:id/contact/:contactId"
                icon={<UsersIcon className="h-6 w-6" />}
                childMaxHeight={100}
                title="Contact"
              >
                {data
                  ?.find((item) => item.Id === id)
                  ?.Contact.map((contact) => (
                    <NavLink
                      key={contact.Id}
                      className={({ isActive }) =>
                        isActive ? 'dropdown-item-active' : 'dropdown-item'
                      }
                      to={`contact/${contact.Id}`}
                    >
                      {contact.Name}
                    </NavLink>
                  ))}
              </DropDown>
              <NavItem
                title="Needs & Objectives"
                to={`needs/${
                  data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                }`}
                icon={<ClipboardListIcon className="h-6 w-6" />}
              />
              <DropDown
                activePath="/loans/:id/assets/:assetId"
                icon={<HomeIcon className="h-6 w-6" />}
                childMaxHeight={100}
                title="Assets"
              >
                {data
                  ?.find((item) => item.Id === id)
                  ?.A_Asset__c.map((asset) => (
                    <NavLink
                      key={asset.Id}
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-item-active group relative'
                          : 'dropdown-item group relative'
                      }
                      to={`assets/${asset.Id}`}
                    >
                      <div>{asset.Name}</div>
                      <MinusCircleIcon
                        onClick={(e: any) => onAssetDelete(e, asset.Id)}
                        className="z-50 fill-white w-6 absolute right-2 top-0 bottom-0 my-auto invisible group-hover:visible"
                      />
                    </NavLink>
                  ))}
                <NavLink
                  key={'new'}
                  className={({ isActive }) =>
                    isActive ? 'dropdown-item-active' : 'dropdown-item'
                  }
                  to={`assets/new?factFindId=${
                    data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                  }`}
                >
                  +
                </NavLink>
              </DropDown>
              <DropDown
                activePath="/loans/:id/liability/:liabilityId"
                icon={<ChartBarIcon className="h-6 w-6" />}
                childMaxHeight={100}
                title="Liabilities"
              >
                {data
                  ?.find((item) => item.Id === id)
                  ?.A_Liability__c.map((liability) => (
                    <NavLink
                      key={liability.Id}
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-item-active group relative'
                          : 'dropdown-item group relative'
                      }
                      to={`liability/${liability.Id}`}
                    >
                      <div>{liability.Name}</div>
                      <MinusCircleIcon
                        onClick={(e: any) => onLiabilityDelete(e, liability.Id)}
                        className="z-50 fill-white w-6 absolute right-2 top-0 bottom-0 my-auto invisible group-hover:visible"
                      />
                    </NavLink>
                  ))}
                <NavLink
                  key={'new'}
                  className={({ isActive }) =>
                    isActive ? 'dropdown-item-active' : 'dropdown-item'
                  }
                  to={`liability/new?factFindId=${
                    data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                  }`}
                >
                  +
                </NavLink>
              </DropDown>
              <DropDown
                activePath="/loans/:id/production/:productionId"
                icon={<DocumentReportIcon className="h-6 w-6" />}
                childMaxHeight={100}
                title="Production Selection"
              >
                {data
                  ?.find((item) => item.Id === id)
                  ?.Loan_Information__c.map((production) => (
                    <NavLink
                      key={production.Id}
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-item-active group relative'
                          : 'dropdown-item group relative'
                      }
                      to={`production/${production.Id}`}
                    >
                      <div>{production.Name}</div>
                      <MinusCircleIcon
                        onClick={(e: any) =>
                          onProductionDelete(e, production.Id)
                        }
                        className="z-50 fill-white w-6 absolute right-2 top-0 bottom-0 my-auto invisible group-hover:visible"
                      />
                    </NavLink>
                  ))}
                <NavLink
                  key={'new'}
                  className={({ isActive }) =>
                    isActive ? 'dropdown-item-active' : 'dropdown-item'
                  }
                  to={`production/new?factFindId=${
                    data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                  }`}
                >
                  +
                </NavLink>
              </DropDown>
              <DropDown
                activePath="/loans/:id/expense/:expenseId"
                icon={<CalculatorIcon className="h-6 w-6" />}
                childMaxHeight={100}
                title="Expenses"
              >
                {data
                  ?.find((item) => item.Id === id)
                  ?.Expenses__c.map((expense) => (
                    <NavLink
                      key={expense.Id}
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-item-active group relative'
                          : 'dropdown-item group relative'
                      }
                      to={`expense/${expense.Id}`}
                    >
                      <div>{expense.Name}</div>
                      <MinusCircleIcon
                        onClick={(e: any) => onExpenseDelete(e, expense.Id)}
                        className="z-50 fill-white w-6 absolute right-2 top-0 bottom-0 my-auto invisible group-hover:visible"
                      />
                    </NavLink>
                  ))}
                <NavLink
                  key={'new'}
                  className={({ isActive }) =>
                    isActive ? 'dropdown-item-active' : 'dropdown-item'
                  }
                  to={`expense/new?factFindId=${
                    data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                  }`}
                >
                  +
                </NavLink>
              </DropDown>
              <DropDown
                activePath="/loans/:id/employment/:employmentId"
                icon={<IdentificationIcon className="h-6 w-6" />}
                childMaxHeight={100}
                title="Employments"
              >
                {data
                  ?.find((item) => item.Id === id)
                  ?.A_Employment__c.map((employment) => (
                    <NavLink
                      key={employment.Id}
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-item-active group relative'
                          : 'dropdown-item group relative'
                      }
                      to={`employment/${employment.Id}`}
                    >
                      <div>{employment.Name}</div>
                      <MinusCircleIcon
                        onClick={(e: any) =>
                          onEmploymentDelete(e, employment.Id)
                        }
                        className="z-50 fill-white w-6 absolute right-2 top-0 bottom-0 my-auto invisible group-hover:visible"
                      />
                    </NavLink>
                  ))}
                <NavLink
                  key={'new'}
                  className={({ isActive }) =>
                    isActive ? 'dropdown-item-active' : 'dropdown-item'
                  }
                  to={`employment/new?factFindId=${
                    data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                  }`}
                >
                  +
                </NavLink>
              </DropDown>
              <DropDown
                activePath="/loans/:id/income/:incomeId"
                icon={<CurrencyDollarIcon className="h-6 w-6" />}
                childMaxHeight={100}
                title="Income"
              >
                {data
                  ?.find((item) => item.Id === id)
                  ?.A_Income__c.map((income) => (
                    <NavLink
                      key={income.Id}
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-item-active group relative'
                          : 'dropdown-item group relative'
                      }
                      to={`income/${income.Id}`}
                    >
                      <div>{income.Name}</div>
                      <MinusCircleIcon
                        onClick={(e: any) => onIncomeDelete(e, income.Id)}
                        className="z-50 fill-white w-6 absolute right-2 top-0 bottom-0 my-auto invisible group-hover:visible"
                      />
                    </NavLink>
                  ))}
                <NavLink
                  key={'new'}
                  className={({ isActive }) =>
                    isActive ? 'dropdown-item-active' : 'dropdown-item'
                  }
                  to={`income/new?factFindId=${
                    data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                  }`}
                >
                  +
                </NavLink>
              </DropDown>
              <NavItem
                title="Product Requirement"
                to={`requirement/${
                  data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                }`}
                icon={<NewspaperIcon className="h-6 w-6" />}
              />
              <NavItem
                title="Funds to Complete"
                to={`funds/${
                  data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                }`}
                icon={<SupportIcon className="h-6 w-6" />}
              />
              <DropDown
                activePath="/loans/:id/credit/:creditId"
                icon={<DocumentTextIcon className="h-6 w-6" />}
                childMaxHeight={100}
                title="Credit History"
              >
                {data
                  ?.find((item) => item.Id === id)
                  ?.Credit_History__c.map((credit) => (
                    <NavLink
                      key={credit.Id}
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-item-active group relative'
                          : 'dropdown-item group relative'
                      }
                      to={`credit/${credit.Id}`}
                    >
                      <div>{credit.Name}</div>
                      <MinusCircleIcon
                        onClick={(e: any) => onCreditDelete(e, credit.Id)}
                        className="z-50 fill-white w-6 absolute right-2 top-0 bottom-0 my-auto invisible group-hover:visible"
                      />
                    </NavLink>
                  ))}
                <NavLink
                  key={'new'}
                  className={({ isActive }) =>
                    isActive ? 'dropdown-item-active' : 'dropdown-item'
                  }
                  to={`credit/new?factFindId=${
                    data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                  }`}
                >
                  +
                </NavLink>
              </DropDown>
              <DropDown
                activePath="/loans/:id/living/:livingId"
                icon={<ShoppingCartIcon className="h-6 w-6" />}
                childMaxHeight={100}
                title="Living History"
              >
                {data
                  ?.find((item) => item.Id === id)
                  ?.Living_History__c.map((living) => (
                    <NavLink
                      key={living.Id}
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-item-active group relative'
                          : 'dropdown-item group relative'
                      }
                      to={`living/${living.Id}`}
                    >
                      <div>{living.Name}</div>
                      <MinusCircleIcon
                        onClick={(e: any) => onLivingDelete(e, living.Id)}
                        className="z-50 fill-white w-6 absolute right-2 top-0 bottom-0 my-auto invisible group-hover:visible"
                      />
                    </NavLink>
                  ))}
                <NavLink
                  key={'new'}
                  className={({ isActive }) =>
                    isActive ? 'dropdown-item-active' : 'dropdown-item'
                  }
                  to={`living/new?factFindId=${
                    data?.find((item) => item.Id === id)?.Fact_Find__c[0].Id
                  }`}
                >
                  +
                </NavLink>
              </DropDown>
            </div>
          </nav>
        ) : (
          <Loading />
        )}
      </div>
      <div className=" flex-1 relative">
        <Outlet />
      </div>
    </div>
  );
}

interface NavItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
}

function NavItem({ title, to, icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? 'nav-item-active' : 'nav-item')}
      end
    >
      <div className="mr-4">{icon}</div>
      <div>{title}</div>
    </NavLink>
  );
}
