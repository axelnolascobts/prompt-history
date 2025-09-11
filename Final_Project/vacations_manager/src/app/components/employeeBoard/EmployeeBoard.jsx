import { ActionIndex } from "./ActionIndex"
import { DayBalance } from "./DayBalance"
import { TrackingBoard } from "./TrackingBoard"

export const EmployeeBoard = () => {

    return(
        <section className="board-container">
            <article className="history-and-request">

                <ActionIndex></ActionIndex>
                <DayBalance></DayBalance>

            </article>
            <article className="request-tracking">

                <TrackingBoard></TrackingBoard>

            </article>
        </section>
    );
}