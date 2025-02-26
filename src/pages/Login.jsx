import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import TextBox from "../components/TextBox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {toast} from "sonner"
import Loader from "../components/Loader"
import { useLoginMutation, useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

const Login = () => {
  const { user }= useSelector(state => state.auth)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const nav = useNavigate();
  const dispatch = useDispatch()

  const[isSignup, setIsSignup] = useState(false)

  const [login, {isLoading}] = useLoginMutation()
  const [addNewUser] = useRegisterMutation()

  const submitHandler = async (data) => {
    if(isSignup){
      try {
        const res = await addNewUser({
          ...data,
          password: data.password,
          role:"user",
        }).unwrap()

        toast.success("New user created succcessfully")

        reset()

       setIsSignup(false)
      } catch (error) {
        toast.error(error?.data?.message || error.message)
      }
    }else{
      try {
        const result =await login(data).unwrap()
        dispatch(setCredentials(result))
        nav("/")
        toast.success("Login Successful")      
      } catch (error) {
        toast.error(error?.data?.message || error.message)
      }
    }
  };

  useEffect(() => {
    user && nav("/dashboard");
  }, [user]);
  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
        <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
          {/* Left side */}
          <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
            <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
              <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600">
                Manage All you tasks in one place
              </span>
              <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
                {/* <span>Cloud Based</span> */}
                <span>Task Tracker</span>
              </p>
            </div>
            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
          {/* right side */}
          {
            isSignup 
            ? 
           ( <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="form-container w-full md:w-[400px] flex flex-col gap-y-4 bg-white px-10 pt-4 pb-6"
            >
              <div className="text-center">
                <p className="text-blue-600 text-3xl font-bold text-center">
                  Signup Here!
                </p>
                <span className="text-base text-gray-700 text-center ">
                  Keep all your credentials safe
                </span>
              </div>
              <div className="flex flex-col gap-y-2">
                    <TextBox
                    placeholder='Full name'
                    type='text'
                    name='name'
                    label='Full Name'
                    className='w-full rounded'
                    register={register("name", {
                      required: "Full name is required!",
                    })}
                    error={errors.name ? errors.name.message : ""}
                  />
                    <TextBox
                    placeholder='Title'
                    type='text'
                    name='title'
                    label='Title'
                    className='w-full rounded'
                    register={register("title", {
                      required: "Title is required!",
                    })}
                    error={errors.title ? errors.title.message : ""}
                  />
                  <TextBox placeholder="email@example.com"
                  type="email"
                  name="email"
                  label="Email Address"
                  className='w-full rounded'
                  register={register("email",{
                    required: "Email address is required!"
                  })}
                   error={errors.email ? errors.email.message : ""}
                  />
                  <TextBox placeholder="Your Password"
                  type="password"
                  name="password"
                  label="Password"
                  className='w-full rounded'
                  register={register("password",{
                    required: "Password is required!",
                    minLength: { value: 6, message: "Password must be at least 6 characters long" },
                  })}
                   error={errors.password ? errors.password.message : ""}
                  />
                    <TextBox
                    placeholder='Confirm Password'
                    type='password'
                    name='confirmPassword'
                    label='confirm password'
                    className='w-full rounded'
                    register={register("confirmPassword", {
                      required: "confirm password is required!",
                      validate: (value) =>
                        value === password || "Passwords do not match!",
                    })}
                    error={errors.confirmPassword ? errors.confirmPassword.message : ""}
                  />

                  <Link className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer" onClick={()=> setIsSignup((prev)=> !prev)}>
                    login
                  </Link>
                     { isLoading ? (<Loader/>) : (<Button
                        type="submit"
                        label="Submit"
                        className="w-full h-10 bg-blue-700 text-white rounded-full"
                      />)}
                </div>
            </form>
          </div>)
          :  
          (<div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="text-center">
              <p className="text-blue-600 text-3xl font-bold text-center">
                Welcome Back!
              </p>
              <span className="text-base text-gray-700 text-center ">
                Keep all your credentials safe
              </span>
            </div>
            <div className="flex flex-col gap-y-5">
                <TextBox placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className='w-full rounded-full'
                register={register("email",{
                  required: "Email address is required!"
                })}
                 error={errors.email ? errors.email.message : ""}
                />
                <TextBox placeholder="Your Password"
                type="password"
                name="password"
                label="Password"
                className='w-full rounded-full'
                register={register("password",{
                  required: "Password is required!"
                })}
                 error={errors.password ? errors.password.message : ""}
                />

                <Link className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer" onClick={()=> setIsSignup((prev)=> !prev)}>
                  sign-up
                </Link> 
                   { isLoading ? (<Loader/>) : (<Button
                      type="submit"
                      label="Submit"
                      className="w-full h-10 bg-blue-700 text-white rounded-full"
                    />)}
              </div>
          </form>
        </div>)
          }
         
        </div>
      </div>
    </>
  );
};

export default Login;
