"use client";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { createTask } from "@/utils/apiCalls/CreateTask";
import { useUserContext } from "@/context/userContexts";

type Props = {
  onOpen: any;
  isOpen: any;
  onOpenChange: any;
  refresh:any;
    setRefresh:any;
};
const InsertModal = ({ onOpen, isOpen, onOpenChange,refresh,setRefresh }: Props) => {
  const { user } = useUserContext();
  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const handleAddTask = () => {
    try {
      createTask(
        { task, desc, priority, status },
        user.token ? user.token : ""
      ).then((res) => {
        if (task === "" || desc === "" || priority === "" || status === "") {
          return toast.error("Please fill all the fields");
        }
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Task Added !");
          setTask("");
          setDesc("");
          setPriority("");
          setStatus("");
          onOpenChange(false);
          setRefresh(!refresh)
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <Button onPress={onOpen} color="primary">Open Modal</Button> */}
      <Modal
        backdrop={"blur"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="mx-4"    
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Task
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Task"
                  variant="bordered"
                  type="text"
                  onChange={(e) => {
                    setTask(e.target.value);
                  }}
                  value={task}
                />
                <Input
                  label="Description"
                  type="text"
                  variant="bordered"
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  value={desc}
                />
                <Select
                  label="Priority"
                  variant="bordered"
                  onChange={(e) => {
                    setPriority(e.target.value);
                  }}
                  value={priority}
                >
                  <SelectItem key="Low" value="Low">
                    Low
                  </SelectItem>
                  <SelectItem key="Medium" value="Medium">
                    Medium
                  </SelectItem>
                  <SelectItem key="High" value="High">
                    High
                  </SelectItem>
                </Select>

                <Select
                  label="Status"
                  variant="bordered"
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  value={status}
                >
                  <SelectItem key="Inactive" value="Inactive" color="danger">
                    Inactive
                  </SelectItem>
                  <SelectItem key="Active" value="Active" color="warning">
                    Active
                  </SelectItem>
                  <SelectItem key="Completed" value="Completed" color="success">
                    Completed
                  </SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleAddTask}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default InsertModal;
