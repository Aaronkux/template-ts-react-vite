import React from 'react';

interface ContentTitleProps {
  currentPage?: number;
  totalPages?: number;
  title: string;
  hiddenPage?: boolean;
}

export default function ContentTitle({
  currentPage,
  totalPages,
  title,
  hiddenPage = false,
}: ContentTitleProps) {
  return (
    <div className="flex justify-start items-baseline pb-8 relative">
      <div className="mr-4 text-2xl font-semibold text-[#3e3a39]">{title}</div>
      {!hiddenPage && (
        <div className="font-semibold text-[#595758]">{`page ${currentPage} of ${totalPages}`}</div>
      )}
    </div>
  );
}
