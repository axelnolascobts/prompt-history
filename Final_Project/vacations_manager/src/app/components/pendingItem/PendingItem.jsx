export const PendingItem = () => {

    return(
        <section className="pending-globe">

            <div className="pending-top-part">
                <div className="high-top-part">

                    <div className="left-side employee-name">Name: Panchito</div>
                    <div className="right-side">Request Date: 05 - 05 - 2025</div>

                </div>
                <div className="mid-top-part">

                    <div className="mid-left-side">Initial Date: 05 - 05 - 2025</div>
                    <div className="mid-mid-side">Final Date: 09 - 05 - 2025</div>
                    <div className="mid-right-side">Reason: Vacations</div>

                </div>
                <div className="low-top-part">

                    <div className="low-side">Client Confirmation</div>

                </div>

            </div>
            <div className="pending-bottom-part">

                <div className="left-side">
                    <button className="accept-button">Accept</button>
                </div>
                <div className="right-side">
                    <button className="reject-button">Reject</button>
                </div>

            </div>
          
        </section>
    );
}