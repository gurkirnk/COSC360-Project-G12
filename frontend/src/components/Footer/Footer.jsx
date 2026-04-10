import './Footer.css';

export default function Footer(){
    return(
        <footer>
            <p className="footer-heading">Explore</p>
            <ul className="footer-links">
                <li><a href="/browse?genre=horror">Horror</a></li>
                <li><a href="/browse?genre=action">Action</a></li>
                <li><a href="/browse?genre=romance">Romance</a></li>
                <li><a href="/browse?genre=scifi">Science Fiction</a></li>
            </ul>
        </footer>
    );
}