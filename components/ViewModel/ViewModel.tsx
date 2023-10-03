"use client";
import React, { useEffect } from "react";
import { useState } from "react";

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
                  <div>
                    <p className="font-semibold">Task</p>
                    <p>{data.task}</p>
                    <Divider className="my-1" />
                  </div>

                  <div>
                    <p className="font-semibold">Description</p>
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
                    <p>{data.status}</p>
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
                    ) : 
                    <p>Never</p>
                }
               
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewModel;
