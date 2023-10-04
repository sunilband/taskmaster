"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { Chip } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Divider } from "@nextui-org/react";

import { useUserContext } from "@/context/userContexts";
import { dateParser, timeParser } from "@/utils/utils";
import { Flip, Slide, toast } from "react-toastify";

type Props = {
  onOpenView: any;
  isOpenView: any;
  onOpenChangeView: any;
  data: any;
  refresh: any;
  setRefresh: any;
};
const ViewModel = ({
  onOpenView,
  isOpenView,
  onOpenChangeView,
  data,
  refresh,
  setRefresh,
}: Props) => {
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

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(data.desc)
      .then(() => {
        // toast.info("Copied to clipboard");
        toast.info("Copied to clipboard", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "light",
          transition: Flip,
        });
      })
      .catch((err) => {
        console.error("Error copying to clipboard: ", err);
      });
  };

  return (
    <>
      {/* <Button onPress={onOpen} color="primary">Open Modal</Button> */}
      <Modal
        backdrop={"blur"}
        isOpen={isOpenView}
        onOpenChange={onOpenChangeView}
        placement="center"
        className="mx-4"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                About Task
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <div className="border-b-2">
                    <p className="font-semibold">Task</p>
                    <p>{data.task}</p>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <p className="font-semibold ">Description</p>

                      <button onClick={copyToClipboard}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 384 512"
                        >
                          <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                        </svg>
                      </button>
                    </div>

                    <p>{data.desc}</p>
                    <Divider className="my-1" />
                  </div>

                  <div>
                    <p className="font-semibold">Priority</p>
                    <p>{data.priority}</p>
                    <Divider className="my-1" />
                  </div>
                  <div>
                    <p className="font-semibold">Status</p>
                    <Chip
            variant="faded"
            color={data.status == "Completed" ? "success" : data.status == "Active" ? "warning" : "danger" }
          >
            {data.status}
          </Chip>
                   
                    <Divider className="my-1" />
                  </div>
                  <div>
                    <p className="font-semibold">Created</p>
                    <p>
                      {dateParser(data.createdAt) +
                        " " +
                        timeParser(data.createdAt)}
                    </p>
                    <Divider className="my-1" />
                  </div>

                  <div>
                    <p className="font-semibold">Updated</p>
                    {data.createdAt != data.updatedAt ? (
                      <p>
                        {dateParser(data.createdAt) +
                          " " +
                          timeParser(data.createdAt)}
                      </p>
                    ) : (
                      <p>Never</p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewModel;
