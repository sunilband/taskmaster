"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import "react-quill/dist/quill.snow.css";

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
import { useUserContext } from "@/context/userContexts";
import { updatetask } from "@/utils/apiCalls/UpdateTask";

type Props = {
  onOpenUpdate: any;
isOpenUpdate: any;
  onOpenChangeUpdate: any;
  data: any;
  refresh: any;
  setRefresh: any;
};
const UpdateModal = ({
  onOpenUpdate,
  isOpenUpdate,
  onOpenChangeUpdate,
  data,
  refresh,
  setRefresh,
}: Props) => {
  const [disabled, setDisabled] = useState(false);
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
    // check if updated or values same
    if (
      task === data.task &&
      desc === data.desc &&
      priority === data.priority &&
      status === data.status
    ) {
      return toast.info("No changes made");
    }

    try {
      setDisabled(true);
      updatetask(
        { task, desc, priority, status, id: data.id },
        user.token ? user.token : ""
      ).then((res) => {
        if (task === "" || desc === "" || priority === "" || status === "") {
          setDisabled(false);
          return toast.error("Please fill all the fields");
        }
        if (res.error) {
          setDisabled(false);
          toast.error(res.error);
        } else {
          setDisabled(true);
          toast.success(res.message);
          setDisabled(false);
          setRefresh(!refresh);
          setTask("");
          setDesc("");
          setPriority("");
          setStatus("");
          onOpenChangeUpdate(false);
        }
      });
    } catch (error) {
      setDisabled(false);
      console.log(error);
    }
  };

  return (
    <>
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
                  label="Task"
                  variant="bordered"
                  type="text"
                  onChange={(e) => {
                    setTask(e.target.value);
                  }}
                  defaultValue={data.task}
                />

                <ReactQuill
                  defaultValue={data.desc}
                  theme="snow"
                  value={desc}
                  onChange={setDesc}
                  className="h-[200px] sm:mb-[4.25rem] mb-[7.5rem]"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }, { font: [] }],
                      ["bold", "italic", "underline", "strike"],
                      ["blockquote", "code-block"],
                      [
                        { align: [] },
                        { list: "ordered" },
                        { list: "bullet" },
                        { list: "check" },
                      ],
                      ["link", { color: [] }, { background: [] }, "clean"],
                    ],
                  }}
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
                <Button
                  color="warning"
                  onPress={handleAddTask}
                  isDisabled={disabled}
                >
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
