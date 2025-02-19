import React, { useState } from 'react'
import ModalWrapper from "../ModalWrapper.jsx"
import {  DialogTitle } from '@headlessui/react'
import {useForm} from "react-hook-form"
import Button from "../Button.jsx"
import TextBox from '../TextBox.jsx'
import UserList from './UserList.jsx'
import SelectList from '../SelectList.jsx'
import { BsImage } from 'react-icons/bs'
import {getStorage, ref, getDownloadURL, uploadBytesResumable} from "firebase/storage"
import {app} from "../../utils/Firebase.js"
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../redux/slices/api/taskApiSlice.js'
import { toast } from 'sonner'
import { dateFormatter } from '../../utils/index.js'
const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"]
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"]

const uploadedFileURLs = []

const AddTask = ({open, setOpen, task}) => {
  // console.log(task?.team)
  const defaultValues = {
    title: task?.title || "task",
    date: dateFormatter(task?.date || new Date()),
    team: [],
    stage: "",
    priority: "",
    assets: []
  }

    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues})

    const [team, setTeam] =  useState(task?.team || [])
  
    const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0])
    const [assets, setAssets] = useState([]);
    const [priority, setPriority] = useState(
      task?.priority?.toUpperCase() || PRIORITY[2]
    );
    const [uploading, setUploading] = useState(false);

    const [createTask, {isLoading}] = useCreateTaskMutation()
    const [updateTask, {isLoading: isUpdating}] = useUpdateTaskMutation()

    const URLs = task?.assets ? [...task.assets] : []

    const submitHandler = async(data)=>{
      for(const file of assets){
        setUploading(true)
        try {
          await uploadFile(file)
        } catch (error) {
          console.error("Error uploading file:" , error.message)
          return
        } finally{
          setUploading(false)
        }
      }
      
      try {
        const newData = {
          ...data,
          assets: [...URLs, ...uploadedFileURLs],
          team,
          stage,
          priority
        }

        const res = task?.id
            ? await updateTask({...newData, _id: task._id}).unwrap() : await createTask(newData).unwrap()
            toast.success(res.message)

            setTimeout(()=>{
              setOpen(false)
            }, 500)

      } catch (error) {
        console.error(error.message)
        toast.error(error.message || error.data.message)
      }
    }
  
    const handleSelect = (e) => {
      setAssets(e.target.files);
    };

    const uploadFile = async (file)=>{
      const storage = getStorage(app)

      const name = new Date().getTime() + file.name

      const storageRef = ref(storage, name)

      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise ((resolve, reject)=>{
        uploadTask.on(
          "state_changed",
          (snapshot) =>{
            console.log("Uploading")
          },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL)=> {
            uploadedFileURLs.push(downloadURL)
            resolve()
          })
          .catch((error)=>{
            reject(error)
          })
        }
        )
      })
    }
   
  return<>
  <ModalWrapper open={open} setOpen={setOpen}>
    <form onSubmit={handleSubmit(submitHandler)}>
        <DialogTitle
        as="h2"
        className='text-base font-bold leading-6 text-gray-900 mb-4'>
                {task?._id ? "UPDATE TASK" : "ADD TASK"}
        </DialogTitle>

        <div className="mt-2 flex flex-col gap-6 ">
            <TextBox
            placeholder="Task Title"
            type="text"
            name="title"
            lable="Task Title"
            className="w-full rounded"
            register={register("title", {required: "title is required"})}
            error={errors.title ? errors.title.message : " "}/>

            <UserList
            setTeam={setTeam}
            team={team}
            />

            <div className="flex gap-4">
                <SelectList
                label="Task Stage"
                lists={LISTS}
                selected = {stage}
                setSelected = {setStage}
                />
                <div className="w-full">
              <TextBox 
              placeholder="Date"
              type="date"
              name="date"
              label="Task Date"
              className="w-full rounded"
              register= {register("date", {
                required: "Date is Required!",
              })}
              error={errors.data? errors.date.message : ""}/>
            </div>
            </div>
            <div className='flex gap-4'>
              <SelectList
                label='Priority Level'
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className='w-full flex items-center justify-center mt-4'>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={(e) => handleSelect(e)}
                    accept='.jpg, .png, .jpeg'
                    multiple={true}
                  />
                  <BsImage />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
              {uploading ? (
                <span className='text-sm py-2 text-red-500'>
                  Uploading assets
                </span>
              ) : (
                <Button
                  label='Submit'
                  type='submit'
                  className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                />
              )}

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
        </div>
    </form>

  </ModalWrapper>
  </>
}

export default AddTask