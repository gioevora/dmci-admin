import React from 'react';
import { Pagination as NextUIPagination } from '@nextui-org/react';

interface PaginationProps {
    total: number;
    page: number;
    onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ total, page, onChange }) => {
    return (
        <NextUIPagination
            total={total}
            page={page}
            onChange={onChange}
            className="flex justify-center mt-4"
        />
    );
};

