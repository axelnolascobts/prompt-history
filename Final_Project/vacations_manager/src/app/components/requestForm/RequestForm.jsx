export const RequestForm = () => {

    return(
        <section className="history-container">
            <form method="POST">
                <section className="request-form">
                    <div className="clinet-confirmation-area">
                        <label htmlFor="image">Client Confirmation Screenshot (JPG o PNG):</label>
                        <input type="file" id="client-confirmation" name="client-confirmation" accept=".jpg, .png" required />
                    </div>

                </section>
                
                

                <label htmlFor="option">Reason:</label>
                <select id="option" name="option" required>
                    <option value="opcion1">Vacations</option>
                    <option value="opcion2">Sick leave</option>
                    <option value="opcion3">Unpaid leave</option>
                    <option value="opcion4">Special Reason</option>
                </select>

                <label htmlFor="start_date">Initial Date:</label>
                <input type="date" id="start_date" name="start_date" required />

                <label htmlFor="end_date">Final Date:</label>
                <input type="date" id="end_date" name="end_date" required />

                <label htmlFor="notes">Notes:</label>
                <textarea id="notes" name="notes"></textarea>

                <button type="submit">Send Request</button>
            </form>
        </section>
    );
}