import React, { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import mortgage_logo from '@/assets/mortgage_logo.svg';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserCircleIcon } from '@heroicons/react/solid';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { setUser } = useAuth();
  return (
    <Disclosure as="nav" className="bg-[hsla(0,0%,100%,.5)] shadow-md">
      <div className="relative flex items-stretch justify-between h-16">
        <div className="sm:hidden flex-1" />
        <div className="basis-64 shrink-0">
          <img src={mortgage_logo} alt="Workflow" />
        </div>
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          {/* Mobile menu button */}
          <Disclosure.Button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {open ? (
              <XIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
            )}
          </Disclosure.Button>
        </div>
        <div className="flex-1 flex items-stretch justify-center sm:items-stretch sm:justify-start">
          <div className="space-x-4 hidden sm:flex sm:ml-6">
            <NavLink
              className={({ isActive }) =>
                isActive ? 'navbar-item-active' : 'navbar-item'
              }
              to="home"
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'navbar-item-active' : 'navbar-item'
              }
              to="loans"
            >
              My Loans
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'navbar-item-active' : 'navbar-item'
              }
              to="about"
            >
              About
            </NavLink>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:mr-6 sm:pr-0">
          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative">
            <Menu.Button className="flex text-sm rounded-full">
              <UserCircleIcon className="h-8 w-8 rounded-full" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      onClick={() => setUser(null)}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <Disclosure.Panel className="sm:hidden h-screen">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* {navigation.map((item) => (
            <Disclosure.Button
              key={item.name}
              as="a"
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block px-3 py-2 rounded-md text-base font-medium'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.name}
            </Disclosure.Button>
          ))} */}
          <NavLink className="navbar-item" to="contact">
            Contact
          </NavLink>
          <NavLink className="navbar-item" to="needs">
            Needs & Objectives
          </NavLink>
          <NavLink className="navbar-item" to="assets">
            Assets
          </NavLink>
          <NavLink className="navbar-item" to="liabilities">
            Liabilities
          </NavLink>
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}
