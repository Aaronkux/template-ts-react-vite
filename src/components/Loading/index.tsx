import React from 'react';
import './index.less';

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="spinner">
        <div className="cube1" />
        <div className="cube2" />
      </div>
    </div>
  );
}
