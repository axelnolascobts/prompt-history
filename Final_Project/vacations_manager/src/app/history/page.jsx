"use client"

import { useEffect, useState } from "react";
import { Header } from "../components/header/Header"

export default function History() {

    const [path, setPath] = useState("");

    useEffect(() => {
        setPath(window.location.pathname);

    }, []);

    return (
        <>
            <Header path={path}/>
        </>

    );
}