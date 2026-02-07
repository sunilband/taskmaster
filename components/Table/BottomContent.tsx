import React from "react";
import { Pagination, Button } from "@nextui-org/react";

type Props = {
  page: number;
  pages: number;
  setPage: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
};

export const BottomContent = ({
  page,
  pages,
  setPage,
  onNextPage,
  onPreviousPage,
}: Props) => {
  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
      />
      <div className="flex w-[30%] justify-end gap-2 ">
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          className="bg-white disabled:opacity-70"
          onPress={onPreviousPage}
        >
          Previous
        </Button>
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          className="bg-white disabled:opacity-70"
          onPress={onNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
