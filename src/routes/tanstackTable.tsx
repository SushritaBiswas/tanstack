import { createFileRoute } from "@tanstack/react-router";
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    flexRender,
    type SortingState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        city: string;
    };
    phone: number;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
};

export const Route = createFileRoute("/tanstackTable")({
    component: () => {
        const [data, setData] = useState<User[]>([]);
        const [search, setsearch] = useState("");
        const [sorting, setSorting] = useState<SortingState>([]);
        const [pageIndex, setPageIndex] = useState(0);
        //This is set to 5 by default in order to keep 5 things per table
        const [pageSize, setPageSize] = useState(5);

        useEffect(() => {
            fetch("https://jsonplaceholder.typicode.com/users")
                .then((res) => res.json())
                .then((json: User[]) => {
                    console.log(json);
                    setData(json);
                });
        }, []);

        const columnHelper = createColumnHelper<User>();
        const columns = useMemo(
            () => [
                columnHelper.accessor("id", {
                    header: "ID",
                    cell: (info) => info.getValue(),
                    enableSorting: true,
                }),
                columnHelper.accessor("name", {
                    header: "Name",
                    cell: (info) => info.getValue(),
                    enableSorting: true,
                }),
                columnHelper.accessor("username", {
                    header: "Username",
                    cell: (info) => info.getValue(),
                    enableSorting: true,
                }),
                columnHelper.accessor("email", {
                    header: "Email",
                    cell: (info) => info.getValue(),
                    enableSorting: true,
                }),
                columnHelper.accessor((row) => row.address.city, {
                    id: "city",
                    header: "City",
                    cell: (info) => info.getValue(),
                    enableSorting: true,
                    sortingFn: (rowA, rowB, columnId) =>
                        rowA.getValue(columnId).localeCompare(rowB.getValue(columnId)),
                }),
                columnHelper.accessor("phone", {
                    header: "Phone",
                    cell: (info) => info.getValue(),
                    enableSorting: true,
                }),
                columnHelper.accessor("website", {
                    header: "Website",
                    cell: (info) => (
                        <a
                            href={`http://${info.getValue()}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {info.getValue()}
                        </a>
                    ),
                    enableSorting: true,
                }),
                columnHelper.accessor((row) => row.company.name, {
                    id: "companyName",
                    header: "Company Name",
                    cell: (info) => info.getValue(),
                    enableSorting: true,
                }),
                columnHelper.accessor((row) => row.company.catchPhrase, {
                    id: "catchPhrase",
                    header: "Catch Phrase",
                    cell: (info) => info.getValue(),
                    enableSorting: true,
                }),
                columnHelper.accessor((row) => row.company.bs, {
                    id: "businessService",
                    header: "Business Service",
                    cell: (info) => info.getValue(),
                    enableSorting: true,
                }),
            ],
            []
        );

        const filteredData = useMemo(() => {
            const lower = search.toLowerCase();
            return data.filter(
                (user) =>
                    user.name.toLowerCase().includes(lower) ||
                    user.username.toLowerCase().includes(lower) ||
                    user.email.toLowerCase().includes(lower) ||
                    user.address.city.toLowerCase().includes(lower)
            );
        }, [data, search]);

        const table = useReactTable({
            data: filteredData,
            columns,
            state: {
                sorting,
                pagination: { pageIndex, pageSize },
            },
            onPaginationChange: (updater) => {
                const next =
                    typeof updater === "function"
                        ? updater({ pageIndex, pageSize })
                        : updater;
                setPageIndex(next.pageIndex);
                setPageSize(next.pageSize);
            },
            onSortingChange: setSorting,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
        });

        return (
            <div className="p-4">
                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="px-4 py-2 border rounded-md w-full md:w-3/3"
                        value={search}
                        onChange={(e) => {
                            setsearch(e.target.value);
                            table.setPageIndex(0);
                        }}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-800">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            {table.getHeaderGroups().map((group) => (
                                <tr key={group.id}>
                                    {group.headers.map((header) => {
                                        const isSorted = header.column.getIsSorted();
                                        return (
                                            <th
                                                key={header.id}
                                                className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {isSorted ? (isSorted === "asc" ? " 🔼" : " 🔽") : ""}
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex items-center gap-4">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    },
});
