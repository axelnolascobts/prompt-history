import Link from 'next/link';

export const ActionIndex = () => {

    return(
        
        <div className="index-container">
            <Link href="/history" className="index-button">History</Link>
            <Link href="/newRequest" className="index-button">Request Days</Link>
        </div>
    );
}