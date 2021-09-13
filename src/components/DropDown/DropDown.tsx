import React from 'react';
import classnames from 'classnames';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { useMatch } from 'react-router-dom';

interface DropDownProps {
  children: React.ReactNode;
  title: string;
  activePath: string;
  childMaxHeight?: number;
  icon: React.ReactNode;
  collapsed?: boolean;
}

export default function DropDown({
  children,
  title,
  collapsed,
  icon,
  childMaxHeight,
  activePath,
}: DropDownProps) {
  const match = useMatch(activePath);
  const [_collapsed, _setCollapsed] = React.useState(!!match);
  const isCollapsed = collapsed || _collapsed;
  const nums = React.Children.count(children);
  const height = `${nums * (childMaxHeight ?? 40)}px`;

  return (
    <div>
      <div
        className={classnames({
          'nav-item': !match,
          'nav-item-active': match,
        })}
        onClick={() => _setCollapsed(!_collapsed)}
      >
        <div className="mr-4">{icon}</div>
        <span className="grow">{title}</span>
        <ChevronDownIcon
          className={classnames('transition-transform h-7 duration-300', {
            'rotate-0': isCollapsed,
            'rotate-180': !isCollapsed,
          })}
        />
      </div>
      <div className="overflow-hidden">
        <div
          style={isCollapsed ? { maxHeight: height } : { maxHeight: '0' }}
          className={
            'flex flex-col justify-around transition-[max-height] duration-300'
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
