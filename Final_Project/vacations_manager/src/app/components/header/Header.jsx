import Link from 'next/link';

export const Header = ({ path }) => {

    let content;

    const titles = {
        '/history': 'Request History',
        '/newRequest': 'New Request',
        '/pendingRequest': 'Pending Request',
    };

    switch (path) {
        case '/':
            content = (
            <>
                <span className="name">Welcome, Panchito</span>
                <div className="logo-notifications">
                    🔔<span className="notifications">6</span>
                </div>
            </>
            );
            break;

        case '/history':
        case '/newRequest':
        case '/pendingRequest':
            content = (
            <>
                <Link href="/" className="back-home-button">➤</Link>
                <span className="name">{titles[path]}</span>
                <div style={{ width: '70px' }}></div>
            </>
            );
            break;

        default:
            break;
    }

    return(
        <header className="header">
            {content}
        </header>
    );
}