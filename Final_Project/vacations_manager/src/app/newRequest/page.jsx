"use client"

import { useEffect, useState } from "react";
import { Header } from "../components/header/Header"
import { RequestForm } from "../components/requestForm/RequestForm";

export default function NewRequest() {

    const [path, setPath] = useState("");

    useEffect(() => {
        setPath(window.location.pathname);

    }, []);

    return (
        <>
            <Header path={path}/>
            <RequestForm></RequestForm>

        </>

    );
}