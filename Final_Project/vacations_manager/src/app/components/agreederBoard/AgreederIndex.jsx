import Link from 'next/link';

export const AgreederIndex = () => {

    return(

        <div className="agreeder-grid">
            <div className="admin-button">
                <Link href="/pendingRequests" className="index-button">Pending Requests</Link>
            </div>
            <div className="admin-button">
                <Link href="/history" className="index-button">Request History</Link>
            </div>
            <div className="admin-button">
                <Link href="/" className="index-button">Team Reports</Link>
            </div>
        </div>              
    );
}