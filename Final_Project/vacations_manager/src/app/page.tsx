"use client"

import { useEffect, useState } from "react";
import { Header } from "./components/header/Header";
import { EmployeeBoard } from "./components/employeeBoard/EmployeeBoard";
import { AdminBoard } from "./components/adminBoard/AdminBoard"

export default function Home() {

  const [path, setPath] = useState("");

    useEffect(() => {
      setPath(window.location.pathname);

    }, []);

  return (
    <>
      <Header path={path} ></Header>
      <EmployeeBoard></EmployeeBoard>
      {/* <AdminBoard></AdminBoard> */}

    </>
    
  );
}
