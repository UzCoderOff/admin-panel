import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "tailwindcss/tailwind.css";
import { Button } from "primereact/button";
import {ProgressSpinner} from 'primereact/progressspinner'

// Num:  900474227

const Login = () => {
  const [form, setForm] = useState({  
    phone_number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      fetch("https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.success) {
            localStorage.setItem(
              "accessToken",
              data.data?.tokens?.accessToken?.token
            );
            console.log(data.data);
            toast.current.show({
              severity: "success",
              summary: "Login Successful",
              detail: "You are now logged in",
              life: 3000,
            });
            window.location.href = "/";
          } else {
            toast.current.show({
              severity: "error",
              summary: "Login Failed",
              detail: "Invalid credentials",
              life: 3000,
            });
          }
        });
    } catch (err) {
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong!",
        life: 3000,
      });
    }
  };

  useEffect(()=> {
    document.title = "Login"
  },[])

  return (
    <div className="flex justify-center items-center h-screen bg-[#546dc0]">
      <Toast ref={toast} />
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md p-8 bg-[#ffffff42]  rounded-lg backdrop-blur-lg "
      >
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/da/Seal_of_the_Federal_Bureau_of_Investigation.svg"
            alt="FBI Seal"
            className="w-24"
            draggable="false"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium mb-2"
          >
            Phone Number
          </label>
          <InputText
            id="phone_number"
            className="w-full"
            value={form.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            placeholder="Enter phone number"
            type="number"
            minLength={9}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <InputText
            className="w-full "
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            feedback={false}
            toggleMask
            placeholder="Password"
            type="password"
            minLength={8}
            required
          />
        </div>
        <Button
         severity="success"
          type="submit"
          text={false}
          disabled={loading}
          className={classNames(
            "w-full flex align-middle justify-center items-center",
            { "p-button-loading": loading }
          )}
        >
          {loading ? <ProgressSpinner/> : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
