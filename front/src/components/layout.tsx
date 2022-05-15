import NextLink from "next/link";
import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <NextLink passHref href="/">
            <Navbar.Brand href="/">Node Kafka</Navbar.Brand>
          </NextLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container as="main">{children}</Container>
    </>
  );
};

export default Layout;
