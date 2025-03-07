import React from 'react'
import { useForm } from 'react-hook-form'
import { useChangePasswordMutation } from '../redux/slices/api/userApiSlice'
import { toast } from 'sonner'
import ModalWrapper from './ModalWrapper'
import { DialogTitle } from '@headlessui/react'
import TextBox from './TextBox'
import Loading from './Loader'
import Button from './Button'

const ChangePassword = ({open, setOpen}) => {

    const{
        register,
        handleSubmit,
        formState: {errors},
    } = useForm()

    const [changeUserPassword, {isLoading}] = useChangePasswordMutation()

    const handleOnSubmit = async (data)=> {
        if(data.password !== data.cpass){
            toast.warning("Passwords doesn't match")
        }
        try {
            const res= await changeUserPassword(data).unwrap()

            toast.success(res.message)

            setTimeout(()=>{
                setOpen(false)
             },1000)
        } catch (error) {
            toast.error(error.message || "something went wrong")
        }
    }
  return (
    <>
     <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
            <DialogTitle
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'>
                Change Password
            </DialogTitle>

            <div className="mt-2 flex flex-col gap-6">
                <TextBox
                placeholder = 'New Password'
                type="password"
                name = "password"
                label = "New Password" 
                className="w-full rounded"
                register={register("password", {
                    required: "New Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
                />
                <TextBox
                placeholder = 'Confirm New Password'
                type="password"
                name = "cpass"
                label = "Confirm New Password" 
                className="w-full rounded"
                register={register("cpass", {
                    required: "Confirm New Password is required!",
                })}
                error={errors.cpass ? errors.cpass.message : ""}
                />
            </div>

            {
                isLoading ? (
                    <div className="py-5">
                        <Loading/>
                    </div>
                ) : (
                        <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
                            <Button 
                             type='submit'
                              className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-200'
                              label='save'
                              />

                              <button
                              type='button'
                              className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                              onClick={()=> setOpen(false)}>
                                Cancel

                              </button>
                        
                        </div>
                )
            }

        </form>
     </ModalWrapper>
    </>
  )
}

export default ChangePassword