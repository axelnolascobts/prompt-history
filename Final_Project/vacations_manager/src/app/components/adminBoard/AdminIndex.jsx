import Link from 'next/link';

export const AdminIndex = () => {

    return(

        <div className="admin-grid">
            <div className="admin-button">
                <Link href="/" className="index-button">Policy Configuration</Link>
            </div>
            <div className="admin-button">
                <Link href="/" className="index-button">Stakeholder and Contact Management</Link>
            </div>
            <div className="admin-button">
                <Link href="/" className="index-button">Reports and Statistics</Link>
            </div>
            <div className="admin-button">
                <Link href="/" className="index-button">Time-off Type Configuration</Link>
            </div>
            <div className="admin-button">
                <Link href="/" className="index-button">Holiday Management</Link>
            </div>
            <div className="admin-button">
                <Link href="/pendingRequests" className="index-button">Pending Requests</Link>
            </div>
        </div> 
                  
    );
}