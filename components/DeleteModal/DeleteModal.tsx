"use client";
import React, { useEffect } from "react";
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
import { useUserContext } from "@/context/userContexts";
import { deletetask } from "@/utils/apiCalls/DeleteTask";

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
  const handleDeleteTask = () => {
    try {
        const id=data.id;
        deletetask(id,user?.token ? user?.token : "").then((res) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              toast.success(res.message);
              setRefresh(!refresh)
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
                Delete Task
              </ModalHeader>
              <ModalBody>
               <p className="font-semibold">Are you sure you want to delete the following task?</p>
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

export default UpdateModal;
