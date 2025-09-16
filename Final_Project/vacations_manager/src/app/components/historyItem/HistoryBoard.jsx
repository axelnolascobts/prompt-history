import { HistoryItem } from "./HistoryItem";
import { PendingItem } from "../pendingItem/PendingItem";

export const HistoryBoard = () => {

    return(
        <section className="history-container">
            <HistoryItem></HistoryItem>
            <HistoryItem></HistoryItem>
            <PendingItem></PendingItem>
        </section>
    );
}