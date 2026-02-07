"use client";
import React from "react";
import { toast } from "react-toastify";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { deleteTaskAction } from "@/app/actions/task";

import { ITask } from "@/types/index";

type Props = {
  onOpenUpdate: () => void;
  isOpenUpdate: boolean;
  onOpenChangeUpdate: (isOpen: boolean) => void;
  data: ITask;
};
const DeleteModal = ({
  onOpenUpdate,
  isOpenUpdate,
  onOpenChangeUpdate,
  data,
}: Props) => {
  const handleDeleteTask = async () => {
    try {
      const formData = new FormData();
      formData.append("id", data._id);

      const res = await deleteTaskAction(null, formData);

      if (res.success) {
        toast.success(res.message);
        // setRefresh(!refresh); // Not needed with revalidatePath
        onOpenChangeUpdate(false);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
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
                Delete Task
              </ModalHeader>
              <ModalBody>
                <p className="font-semibold">
                  Are you sure you want to delete the following task?
                </p>
                <p>{data.task}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={handleDeleteTask}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteModal;
