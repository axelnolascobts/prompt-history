"use client"

import { useEffect, useState } from "react";
import { Header } from "../components/header/Header";
import { HistoryBoard } from "../components/historyItem/HistoryBoard";

export default function pendingRequests() {

    const [path, setPath] = useState("");

    useEffect(() => {
        setPath(window.location.pathname);

    }, []);

    return (
        <>
            <Header path={path}/>
            <HistoryBoard></HistoryBoard>

        </>

    );
}