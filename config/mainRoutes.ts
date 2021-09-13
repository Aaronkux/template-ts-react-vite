import { CustomRouteObject } from './routes';

const mainRoutesConfig: CustomRouteObject[] = [
  {
    element: '@/layout/MainLayout.tsx',
    children: [
      {
        path: 'loans',
        children: [
          {
            index: true,
            element: '@/pages/LoanList/index.tsx',
          },
          {
            path: ':id',
            element: '@/layout/OpportunityLayout.tsx',
            children: [
              {
                index: true,
                element: '@/pages/Overview/index.tsx',
              },
              {
                path: 'contact/:contactId',
                element: '@/pages/Contact/index.tsx',
              },
              {
                path: 'needs/:factFindId',
                element: '@/pages/NeedsAndObjectives/index.tsx',
              },
              {
                path: 'requirement/:factFindId',
                element: '@/pages/Requirement/index.tsx',
              },
              {
                path: 'assets/:assetId',
                element: '@/pages/Assets/index.tsx',
              },
              {
                path: 'liability/:liabilityId',
                element: '@/pages/Liability/index.tsx',
              },
              {
                path: 'production/:productionId',
                element: '@/pages/Production/index.tsx',
              },
              {
                path: 'expense/:expenseId',
                element: '@/pages/Expense/index.tsx',
              },
              {
                path: 'employment/:employmentId',
                element: '@/pages/Employment/index.tsx',
              },
              {
                path: 'income/:incomeId',
                element: '@/pages/Income/index.tsx',
              },
              {
                path: 'funds/:factFindId',
                element: '@/pages/Funds/index.tsx',
              },
              {
                path: 'credit/:creditId',
                element: '@/pages/Credit/index.tsx',
              },
              {
                path: 'living/:livingId',
                element: '@/pages/Living/index.tsx',
              },
            ],
          },
        ],
      },

      {
        path: 'Home',
        element: '@/pages/Home/index.tsx',
      },
      {
        path: '*',
        element: '@/pages/404/index.tsx',
      },
    ],
  },
];
export default mainRoutesConfig;
