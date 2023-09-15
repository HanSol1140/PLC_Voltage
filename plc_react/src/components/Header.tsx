import {Link} from 'react-router-dom';
import './Header.css';

import React from 'react';

function Header(){
    return (
        <section id='Header'>
            <ul>
                {/* <Link to="/" className='link'><li>Main</li></Link> */}
                <Link to="/" className='link'><li>Settings</li></Link>
            </ul>
        </section>
    );
};

export default Header;