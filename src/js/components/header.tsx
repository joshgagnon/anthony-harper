import * as React from 'react';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

export default () => {
    return <Navbar collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#home"></a>
        </Navbar.Brand>
      </Navbar.Header>

    <Nav pullRight>
      <NavItem eventKey={1} href="#">
            Log In
      </NavItem>
    </Nav>
    </Navbar>;
}