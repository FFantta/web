import React, { Component } from 'react';
import Base from './base';

/**
 * This compounent is the Not Foound page which is shown when the user enters an invalid route/URL.
 */
class NotFound extends Component {
    state = {  } 
    render() { 
        return (
            <Base>
                Not Found
            </Base>
        );
    }
}
 
export default NotFound;