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
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { useUserContext } from "@/context/userContexts";
import { updatetask } from "@/utils/apiCalls/UpdateTask";

type Props = {
  onOpenUpdate: any;
  isOpenUpdate: any;
  onOpenChangeUpdate: any;
  data: any;
  refresh:any;
  setRefresh:any;
};
const UpdateModal = ({ onOpenUpdate, isOpenUpdate, onOpenChangeUpdate,data,refresh,setRefresh }: Props) => {
  const { user } = useUserContext();
  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setTask(data.task);
    setDesc(data.desc);
    setPriority(data.priority);
    setStatus(data.status);
  }, [refresh]);

  const handleAddTask = () => {
    try {
      updatetask(
        { task, desc, priority, status ,id:data.id },
        user.token ? user.token : ""
      ).then((res) => {
        if (task === "" || desc === "" || priority === "" || status === "") {
          return toast.error("Please fill all the fields");
        }
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.message);
          setRefresh(!refresh)
          setTask("");
          setDesc("");
          setPriority("");
          setStatus("");
          onOpenChangeUpdate(false);
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
        isOpen={isOpenUpdate}
        onOpenChange={onOpenChangeUpdate}
        placement="center"
        className="mx-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Task
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
                  defaultValue={data.task}
                  
                />
                <Input
                  label="Description"
                  type="text"
                  variant="bordered"
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  defaultValue={data.desc}
                />
                <Select
                  label="Priority"
                  variant="bordered"
                  onChange={(e) => {
                    setPriority(e.target.value);
                  }}
                  defaultSelectedKeys={[data.priority]}
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
                  defaultSelectedKeys={[data.status]}
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
                <Button color="warning" onPress={handleAddTask}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateModal;
