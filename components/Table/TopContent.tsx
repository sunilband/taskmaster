import React from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { SearchIcon } from "./Icons/SearchIcon";
import { ChevronDownIcon } from "./Icons/ChevronDownIcon";
import { PlusIcon } from "./Icons/PlusIcon";
import { capitalize } from "./utils";
import { columns, statusOptions, priorityOptions } from "./Data";
import { motion } from "framer-motion";

type Props = {
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  statusFilter: any;
  setStatusFilter: any;
  priorityFilter: any;
  setPriorityFilter: any;
  visibleColumns: any;
  setVisibleColumns: any;
  tasksLength: number;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddClick: () => void;
};

export const TopContent = ({
  filterValue,
  onClear,
  onSearchChange,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  visibleColumns,
  setVisibleColumns,
  tasksLength,
  onRowsPerPageChange,
  onAddClick,
}: Props) => {
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
            className="w-full sm:max-w-[400px] mb-3 md:mb-auto"
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
            <DropdownTrigger className=" sm:flex">
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
              {columns
                .filter((column) => column.name !== "ID")
                .map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
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
              endContent={<PlusIcon {...({} as any)} />}
              onPress={onAddClick}
            >
              Add New
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small text-white">
          Total <span className="font-semibold">{tasksLength}</span> tasks
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
};
