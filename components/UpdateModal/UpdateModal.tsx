"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
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
import { updateTaskAction } from "@/app/actions/task";

import { ITask } from "@/types/index";

type Props = {
  onOpenUpdate: () => void;
  isOpenUpdate: boolean;
  onOpenChangeUpdate: (isOpen: boolean) => void;
  data: ITask;
};
const UpdateModal = ({
  onOpenUpdate,
  isOpenUpdate,
  onOpenChangeUpdate,
  data,
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
  }, [data]);

  const handleUpdateTask = async () => {
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

      const formData = new FormData();
      formData.append("id", data._id);
      formData.append("task", task);
      formData.append("desc", desc);
      formData.append("priority", priority);
      formData.append("status", status);

      const res = await updateTaskAction(null, formData);

      if (task === "" || desc === "" || priority === "" || status === "") {
        setDisabled(false);
        return toast.error("Please fill all the fields");
      }

      if (!res.success) {
        setDisabled(false);
        toast.error(res.error);
      } else {
        setDisabled(true);
        toast.success(res.message);
        setDisabled(false);
        // setRefresh(!refresh); // Not needed with revalidatePath
        setTask("");
        setDesc("");
        setPriority("");
        setStatus("");
        onOpenChangeUpdate(false);
      }
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
                  id="editor"
                  className="h-[200px] sm:mb-[4.25rem] mb-[7.5rem] editor"
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
                  onPress={handleUpdateTask}
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
