"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/userContexts";
import { useRouter } from "next/navigation";
import { Flip, toast } from "react-toastify";
import { motion } from "framer-motion";
import { convert } from "html-to-text";

import { useLongPress } from "use-long-press";
import { ITask } from "@/types/index";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  SortDescriptor,
  Selection,
} from "@nextui-org/react";
import { TopContent } from "./TopContent";
import { BottomContent } from "./BottomContent";
import { EditIcon } from "./Icons/EditIcon";
import { DeleteIcon } from "./Icons/DeleteIcon";
import { EyeIcon } from "./Icons/EyeIcon";
import { CheckIcon } from "./Icons/CheckIcon";
import { CloseIcon } from "./Icons/CloseIcon";
import { WorkIcon } from "./Icons/WorkIcon";
import { UpArrow } from "./Icons/UpArrow";
import InsertModal from "../InsertModal/InsertModal";
import UpdateModal from "../UpdateModal/UpdateModal";
import ViewModel from "../ViewModel/ViewModel";
import DeleteModel from "../DeleteModal/DeleteModal";
import { useDisclosure } from "@nextui-org/react";
import { useTaskContext } from "@/context/taskContext";
import { dateParser, timeParser } from "@/utils/utils";
import { columns, statusOptions, priorityOptions } from "./Data";
import { capitalize } from "./utils";

const statusColorMap = {
  Active: "warning",
  Completed: "success",
  Inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "task",
  "desc",
  "priority",
  "status",
  "actions",
  "createdAt",
  "updatedAt",
];

export default function App({ initialTasks }: { initialTasks: ITask[] }) {
  const { user } = useUserContext();
  const router = useRouter();
  const [tasks, setTasks] = useState<ITask[]>(initialTasks || []);
  const [updateButtonClick, setUpdateButtonClick] = useState(false);
  const [viewButtonClick, setViewButtonClick] = useState(false);
  const [addButtonCliked, setAddButtonCliked] = useState(false);
  const [deleteButtonCliked, setDeleteButtonCliked] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [updateData, setUpdateData] = useState<Partial<ITask>>({});
  const [viewData, setViewData] = useState<Partial<ITask>>({});
  const [deleteData, setDeleteData] = useState<Partial<ITask>>({});
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  // description view options
  const options = {
    wordwrap: 130,
    // ...
  };

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns as any).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...tasks];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        (user?.task + " " + user?.desc)
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter as any).includes(user?.status),
      );
    }

    if (
      priorityFilter !== "all" &&
      Array.from(priorityFilter).length !== priorityOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(priorityFilter as any).includes(user?.priority),
      );
    }

    return filteredUsers;
  }, [tasks, filterValue, statusFilter, priorityFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof ITask] ?? "";
      const second = b[sortDescriptor.column as keyof ITask] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((tuple: ITask, columnKey: React.Key) => {
    const cellValue = tuple[columnKey as keyof ITask];

    switch (columnKey) {
      case "task":
        // return task length >10 then add ... at the end and shorten to 10 length
        return tuple.task.length > 20
          ? tuple.task.substring(0, 20) + "..."
          : tuple.task;

      case "desc":
        return convert(tuple.desc, options).length > 20
          ? convert(tuple.desc, options).substring(0, 20) + "..."
          : convert(tuple.desc, options);
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p>{dateParser(tuple.createdAt)}</p>
            <p className="text-[10px]">{timeParser(tuple.createdAt)}</p>
          </div>
        );
      case "updatedAt":
        return tuple.createdAt != tuple.updatedAt ? (
          <div className="flex flex-col">
            <p>{dateParser(tuple.updatedAt)}</p>
            <p className="text-[10px]">{timeParser(tuple.updatedAt)}</p>
          </div>
        ) : (
          <p className="text-blue-500">Never</p>
        );
      case "status":
        return cellValue == "Completed" ? (
          <Chip
            startContent={<CheckIcon size={18} {...({} as any)} />}
            variant="faded"
            color="success"
          >
            {cellValue}
          </Chip>
        ) : cellValue == "Active" ? (
          <Chip
            startContent={<WorkIcon size={18} {...({} as any)} />}
            variant="faded"
            color="warning"
          >
            {cellValue}
          </Chip>
        ) : cellValue == "Inactive" ? (
          <Chip
            startContent={<CloseIcon size={18} {...({} as any)} />}
            variant="faded"
            color="danger"
          >
            {cellValue}
          </Chip>
        ) : null;

      case "priority":
        return cellValue == "High" ? (
          <div className="flex flex-row  items-center gap-1">
            <p>{cellValue}</p>
            <UpArrow />
          </div>
        ) : cellValue == "Medium" ? (
          <div className="flex flex-row  items-center gap-1">
            <p>{cellValue}</p>
            <div className="rotate-90">
              <UpArrow />
            </div>
          </div>
        ) : cellValue == "Low" ? (
          <div className="flex flex-row  items-center gap-1">
            <p>{cellValue}</p>
            <div className="rotate-180">
              <UpArrow />
            </div>
          </div>
        ) : null;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="More Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setUpdateButtonClick(false);
                    setAddButtonCliked(false);
                    setDeleteButtonCliked(false);
                    setViewButtonClick(true);
                    setViewData(tuple);
                    onOpen();
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip content="Edit task">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setViewButtonClick(false);
                    setAddButtonCliked(false);
                    setDeleteButtonCliked(false);
                    setUpdateButtonClick(true);
                    setUpdateData(tuple);
                    onOpen();
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete task">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon
                  onClick={() => {
                    setViewButtonClick(false);
                    setUpdateButtonClick(false);
                    setAddButtonCliked(false);
                    setDeleteButtonCliked(true);
                    setDeleteData(tuple);
                    onOpen();
                  }}
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  const topContent = React.useMemo(() => {
    return (
      <TopContent
        filterValue={filterValue}
        onClear={onClear}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        tasksLength={tasks.length}
        onRowsPerPageChange={onRowsPerPageChange}
        onAddClick={() => {
          setViewButtonClick(false);
          setUpdateButtonClick(false);
          setDeleteButtonCliked(false);
          setAddButtonCliked(true);
          onOpen();
        }}
      />
    );
  }, [
    filterValue,
    statusFilter,
    priorityFilter,
    visibleColumns,
    onRowsPerPageChange,
    tasks.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <BottomContent
        page={page}
        pages={pages}
        setPage={setPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (user?.name) {
      toast.success("Welcome back" + " " + user.name + "!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
        transition: Flip,
      });
    }
  }, [user?.name]);

  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks.reverse());
    }
  }, [initialTasks]);

  // Client-side fetching removed

  const bind = useLongPress((event, item: any) => {
    setUpdateButtonClick(false);
    setAddButtonCliked(false);
    setDeleteButtonCliked(false);
    setViewButtonClick(true);
    setViewData(item);
    onOpen();
  });

  return (
    <div className="h-screen w-screen flex justify-center items-center px-4">
      {addButtonCliked ? (
        <InsertModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onOpen={onOpen}
        />
      ) : null}

      {updateButtonClick ? (
        <UpdateModal
          isOpenUpdate={isOpen}
          onOpenChangeUpdate={onOpenChange}
          onOpenUpdate={onOpen}
          data={updateData as ITask}
        />
      ) : null}

      {viewButtonClick ? (
        <ViewModel
          isOpenView={isOpen}
          onOpenChangeView={onOpenChange}
          onOpenView={onOpen}
          data={viewData as ITask}
        />
      ) : null}

      {deleteButtonCliked ? (
        <DeleteModel
          isOpenUpdate={isOpen}
          onOpenChangeUpdate={onOpenChange}
          onOpenUpdate={onOpen}
          data={deleteData as ITask}
        />
      ) : null}
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px] shadow-xl bg-opacity-70",
        }}
        selectedKeys={selectedKeys}
        selectionMode="single"
        color="primary"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column: any) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No tasks found"} items={sortedItems}>
          {(item) => (
            <TableRow
              key={item._id}
              onDoubleClick={() => {
                setUpdateButtonClick(false);
                setAddButtonCliked(false);
                setDeleteButtonCliked(false);
                setViewButtonClick(true);
                setViewData(item);
                onOpen();
              }}
              {...bind(item as any)}
            >
              {(columnKey) => (
                <TableCell>
                  <motion.div
                    initial={{
                      // scale: 0,
                      x: -100,
                    }}
                    animate={{
                      // scale: 1,
                      x: 0,
                    }}
                    transition={{
                      type: "spring",
                      duration: 1,
                    }}
                    viewport={{ once: true }}
                  >
                    {renderCell(item, columnKey)}
                  </motion.div>
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
