"use client";
import {
    Button,
    Card,
    CardBody,
    Chip,
    Dropdown,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    DropdownItem
} from "@heroui/react";
import React, { useState, useMemo } from "react";
import { LuChevronDown, LuPlus, LuSearch } from "react-icons/lu";

interface Column {
    key: string;
    label: string;
    renderCell?: (row: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    label: string;
    description: string;
    filter: boolean;
    statusOptions?: { key: string; label: string }[];
}

const TableData = ({ columns, data, label, description, statusOptions = [], filter }: DataTableProps) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.key));
    const [roleFilter, setRoleFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const handleColumnFilterChange = (selectedKeys: any) => {
        setVisibleColumns(Array.from(selectedKeys));
    };

    const handleStatusFilterChange = (selectedKeys: any) => {
        const selectedValue = Array.from(selectedKeys)[0] as string;
        console.log("Selected Value:", selectedValue); // ✅ Debug here
    
        if (selectedValue === "for sale" || selectedValue === "for rent" || selectedValue === "all") {
            setStatusFilter(selectedValue);
        } 
        else if (["fix bugs", "improvement", "closed", "all"].includes(selectedValue)) {
            setTypeFilter(selectedValue);
        } 
        else {
            setRoleFilter(selectedValue);
        }
    };
    

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch = columns.some((column) =>
                visibleColumns.includes(column.key) &&
                String(item[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Get the latest status
            const latestStatus = item.statuses?.length
                ? [...item.statuses].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].status
                : "Unknown";


            const matchesStatus = statusFilter === "all" || (item.status && item.status.toLowerCase() === statusFilter.toLowerCase());
            const matchesRole = roleFilter === "all" || (item.role && item.role.toLowerCase() === roleFilter.toLowerCase());
            const matchesType = typeFilter === "all" || (item.type && item.type.toLowerCase() === typeFilter.toLowerCase());

            return matchesSearch && matchesStatus && matchesRole && matchesType;
        });
    }, [searchTerm, data, visibleColumns, columns, statusFilter, roleFilter, typeFilter]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <Card className="shadow-sm border-2 border-gray-100">
            <CardBody>
                <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4 w-full">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-semibold text-violet-800">{label}</h1>
                        <p className="text-gray-500 text-sm">{description || ""}</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="w-full sm:w-auto">
                            <Input
                                startContent={<LuSearch size={18} />}
                                size="lg"
                                type="search"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {filter === false ? (
                            null
                        ) : (
                            <div className="flex items-center gap-2">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button color="primary" endContent={<LuChevronDown />} size="lg" variant="flat" className="capitalize">{statusFilter}</Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Filter by Status"
                                        selectionMode="single"
                                        selectedKeys={new Set([statusFilter])}
                                        onSelectionChange={handleStatusFilterChange}
                                    >
                                        {statusOptions.map((status) => (
                                            <DropdownItem key={status.key}>{status.label}</DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>

                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button color="primary" endContent={<LuChevronDown />} size="lg" variant="flat">Show Columns</Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Table Columns"
                                        closeOnSelect={false}
                                        selectionMode="multiple"
                                        selectedKeys={new Set(visibleColumns)}
                                        onSelectionChange={handleColumnFilterChange}
                                    >
                                        {columns.map((column) => (
                                            <DropdownItem key={column.key}>{column.label}</DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg">
                    <Table>
                        <TableHeader>
                            {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                                <TableColumn key={column.key}>{column.label}</TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody emptyContent={"No data found"}>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <TableRow key={index}>
                                        {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                                            <TableCell key={column.key}>
                                                {column.renderCell ? column.renderCell(item) : item[column.key]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : []}
                        </TableBody>
                    </Table>
                </div>

                <div className="py-2 px-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        Showing {paginatedData.length} of {filteredData.length} items
                    </span>
                    <Pagination
                        isCompact
                        showControls
                        color="primary"
                        page={currentPage}
                        total={totalPages}
                        onChange={setCurrentPage}
                    />
                </div>
            </CardBody>
        </Card>
    );
};

export default TableData;
