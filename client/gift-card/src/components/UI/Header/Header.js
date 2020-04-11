import React, { Component } from 'react';
import classes from './Header.module.css';

import { getTimeOfDay } from '../../../Helpers/timeAndDate';

class Header extends Component {
  /**
   * Props:
   * userName: The name of the user
   */

  render() {
    return (
      <header className={classes.Header}>
        Good {getTimeOfDay()} {this.props.userName}!
      </header>
    );
  }
}

export default Header;
