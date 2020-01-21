import React, { ReactNode, ReactElement } from 'react';

import { Container, Header, Title } from './BigCard.styles';

interface BigCardProps {
  children?: ReactNode;
  title?: string;
  headerChild?: ReactNode;
}

const BigCard = ({ children, title, headerChild }: BigCardProps): ReactElement => (
  <Container>
    <Header>
      <Title>{title}</Title>
      <div className="filler" />
      {headerChild}
    </Header>
    {children}
  </Container>
);

export default BigCard;
