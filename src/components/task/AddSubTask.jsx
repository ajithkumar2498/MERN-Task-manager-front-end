import React from "react";
import { useForm } from "react-hook-form";
import {toast} from "sonner";
import ModalWrapper from "../ModalWrapper";
import { DialogTitle } from "@headlessui/react";
import TextBox from "../TextBox";
import Button from "../Button";
import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [addSubTask]  = useCreateSubTaskMutation()

  const handleOnSubmit = async (data) => {
    try {
        const res = await addSubTask({data, id}).unwrap()
        
        toast.success(res.message)

        setTimeout(() => {
            setOpen(false)
        }, 500);
    } catch (error) {
        console.log(error)
        toast.error(error?.data?.message || error.error)
    }
  };
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <DialogTitle
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            Add SUB-TASK
          </DialogTitle>
          <div className="mt-2 flex flex-col gap-6">
            <TextBox
              placeholder="sub-task title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is Required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            <div className="flex items-center gap-4">
              <TextBox
                placeholder="date"
                type="date"
                name="date"
                label="task date"
                className="w-full rounded"
                register={register("date", {
                  required: "Date is Required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />

              <TextBox
                placeholder="Tag"
                type="text"
                name="tag"
                label="Tag"
                className="w-full rounded"
                register={register("tag", {
                  required: "Tag is Required!",
                })}
                error={errors.tag ? errors.tag.message : ""}
              />
            </div>
          </div>
          <div className="py-3 mt-3 flex sm:flex-row-reverse gap-4">
            <Button
            type="submit"
            className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
            label="Add Task"
            />
            <Button
            type="button"
            className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
            label="Cancel"
            onClick={()=> setOpen(false)}
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddSubTask;
