"use client";
import React, { useEffect } from "react";
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
  Textarea,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { createTask } from "@/utils/apiCalls/CreateTask";
import { useUserContext } from "@/context/userContexts";

type Props = {
  onOpen: any;
  isOpen: any;
  onOpenChange: any;
  refresh: any;
  setRefresh: any;
};
const InsertModal = ({
  onOpen,
  isOpen,
  onOpenChange,
  refresh,
  setRefresh,
}: Props) => {
  const [disabled, setDisabled] = useState(false);
  const { user } = useUserContext();
  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const handleAddTask = () => {
    try {
      setDisabled(true);
      createTask(
        { task, desc, priority, status },
        user.token ? user.token : ""
      ).then((res) => {
        if (task === "" || desc === "" || priority === "" || status === "") {
          setDisabled(false);
          return toast.error("Please fill all the fields");
        }
        if (res.error) {
          toast.error(res.error);
          setDisabled(false);
        } else {
          setDisabled(true);
          toast.success("Task Added !");
          setDisabled(false);
          setTask("");
          setDesc("");
          setPriority("");
          setStatus("");
          onOpenChange(false);
          setRefresh(!refresh);
        }
      });
    } catch (error) {
      setDisabled(false);
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
                  label="Task"
                  variant="bordered"
                  type="text"
                  onChange={(e) => {
                    setTask(e.target.value);
                  }}
                  value={task}
                />
                <Textarea
                  label="Description"
                  type="text"
                  variant="bordered"
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  value={desc}
                  style={{ whiteSpace: 'pre-wrap' }}
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
                <Button
                  color="primary"
                  onPress={handleAddTask}
                  isDisabled={disabled}
                >
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
