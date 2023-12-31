// @ts-nocheck
"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/userContexts";
import { getuser } from "@/utils/apiCalls/GetUser";
import { useRouter } from "next/navigation";
import { Flip, toast } from "react-toastify";
import { motion } from "framer-motion";
import { convert } from "html-to-text";

import { useLongPress } from "use-long-press";
const cookieCutter = require("cookie-cutter");

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Tooltip,
} from "@nextui-org/react";
import { PlusIcon } from "./Icons/PlusIcon";
import { SearchIcon } from "./Icons/SearchIcon";
import { ChevronDownIcon } from "./Icons/ChevronDownIcon";
import { columns, statusOptions, priorityOptions } from "./Data";
import { capitalize } from "./utils";
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
import { gettasks } from "@/utils/apiCalls/GetTasks";
import { dateParser, timeParser } from "@/utils/utils";
import { deletetask } from "@/utils/apiCalls/DeleteTask";

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

export default function App() {
  const { user, setUser } = useUserContext();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState<>([]);
  const [refresh, setRefresh] = useState(false);
  const [updateButtonClick, setUpdateButtonClick] = useState(false);
  const [viewButtonClick, setViewButtonClick] = useState(false);
  const [addButtonCliked, setAddButtonCliked] = useState(false);
  const [deleteButtonCliked, setDeleteButtonCliked] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [updateData, setUpdateData] = useState({});
  const [viewData, setViewData] = useState({});
  const [deleteData, setDeleteData] = useState({});
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
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
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...tasks];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        (user?.task + " " + user?.desc)
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user?.status)
      );
    }

    if (
      priorityFilter !== "all" &&
      Array.from(priorityFilter).length !== priorityOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(priorityFilter).includes(user?.priority)
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
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((tuple, columnKey) => {
    const cellValue = tuple[columnKey];

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
            startContent={<CheckIcon size={18} />}
            variant="faded"
            color="success"
          >
            {cellValue}
          </Chip>
        ) : cellValue == "Active" ? (
          <Chip
            startContent={<WorkIcon size={18} />}
            variant="faded"
            color="warning"
          >
            {cellValue}
          </Chip>
        ) : cellValue == "Inactive" ? (
          <Chip
            startContent={<CloseIcon size={18} />}
            variant="faded"
            color="danger"
          >
            {cellValue}
          </Chip>
        ) : null;

      //   <Chip className="capitalize" color={statusColorMap[tuple.status]} size="sm" variant="flat">
      //     {cellValue}
      //   </Chip>
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

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mt-5">
        <div className="flex sm:flex-row flex-col sm:justify-between items-center">
          <motion.div
            initial={{
              opacity: 0,
              x: -100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              type: "spring",
              duration: 2,
              delay: 0.5,
            }}
            viewport={{ once: true }}
            className="w-full "
          >
            <Input
              isClearable
              className="w-full sm:max-w-[400px]"
              placeholder="Search..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: -100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              type: "spring",
              duration: 2,
              delay: 0.5,
            }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center sm:justify-end sm:w-[200vw] gap-3"
          >
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="solid"
                  color="secondary"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger viewport={{ once: true }} className=" sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="solid"
                  color="secondary"
                >
                  Priority
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={priorityFilter}
                selectionMode="multiple"
                onSelectionChange={setPriorityFilter}
              >
                {priorityOptions.map((priority) => (
                  <DropdownItem key={priority.uid} className="capitalize">
                    {capitalize(priority.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className=" sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="solid"
                  color="secondary"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) =>
                  column.name != "ID" ? (
                    <DropdownItem key={column.uid} className="capitalize">
                      {capitalize(column.name)}
                    </DropdownItem>
                  ) : null
                )}
              </DropdownMenu>
            </Dropdown>
            <motion.div
              initial={{
                opacity: 0,
                x: -100,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                type: "spring",
                duration: 2,
                delay: 0.5,
              }}
              viewport={{ once: true }}
            >
              <Button
                color="primary"
                endContent={<PlusIcon />}
                onPress={() => {
                  setViewButtonClick(false);
                  setUpdateButtonClick(false);
                  setDeleteButtonCliked(false);
                  setAddButtonCliked(true);
                  onOpen();
                }}
              >
                Add New
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small text-white">
            Total <span className="font-semibold">{tasks.length}</span> tasks
          </span>
          <label
            className="flex items-center text-default-400 text-small mx-2 text-white"
            // style={{ color: "#A1A1AA !important" }}
          >
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small  ml-2 text-white font-semibold"
              onChange={onRowsPerPageChange}
            >
              <option value="5" className="text-black">
                5
              </option>
              <option value="10" className="text-black">
                10
              </option>
              <option value="15" className="text-black">
                15
              </option>
            </select>
          </label>
        </div>
      </div>
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
      <div className="py-2 px-2 flex justify-between items-center">
        {/* <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span> */}
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="flex w-[30%] justify-end gap-2 ">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            className="bg-white disabled:opacity-70"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            className="bg-white disabled:opacity-70"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  useEffect(() => {
    const taskmastertoken = cookieCutter.get("taskmastertoken");
    if (taskmastertoken) {
      getuser(taskmastertoken).then((res) => {
        setUser(res.user);
        setToken(res.user?.token);
      });
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (user?.token)
      gettasks(user?.token ? user?.token : "").then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          setTasks(res.data.reverse());
        }
      });
  }, [refresh, user?.token]);

  useEffect(() => {
    if (user?.token)
      toast.success("Welcome Back" + " " + user?.name + "!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
        transition: Flip,
      });
  }, [user?.token]);

  const bind = useLongPress((data) => {
    setUpdateButtonClick(false);
    setAddButtonCliked(false);
    setDeleteButtonCliked(false);
    setViewButtonClick(true);
    setViewData(...data);
    onOpen();
  });

  return (
    <div className="h-screen w-screen flex justify-center items-center px-4">
      {addButtonCliked ? (
        <InsertModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onOpen={onOpen}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ) : null}

      {updateButtonClick ? (
        <UpdateModal
          isOpenUpdate={isOpen}
          onOpenChangeUpdate={onOpenChange}
          onOpenUpdate={onOpen}
          data={updateData}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ) : null}

      {viewButtonClick ? (
        <ViewModel
          isOpenView={isOpen}
          onOpenChangeView={onOpenChange}
          onOpenView={onOpen}
          data={viewData}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ) : null}

      {deleteButtonCliked ? (
        <DeleteModel
          isOpenUpdate={isOpen}
          onOpenChangeUpdate={onOpenChange}
          onOpenUpdate={onOpen}
          data={deleteData}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ) : null}
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px] shadow-xl bg-opacity-70 ",
        }}
        selectedKeys={selectedKeys}
        selectionMode="single"
        color="primary"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        isLoading
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
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
              key={item.id}
              onDoubleClick={() => {
                setUpdateButtonClick(false);
                setAddButtonCliked(false);
                setDeleteButtonCliked(false);
                setViewButtonClick(true);
                setViewData(item);
                onOpen();
              }}
              {...bind(item)}
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
