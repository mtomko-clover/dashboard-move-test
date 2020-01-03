import React, {ReactNode, ReactElement} from "react";

import {Container, Header, Title} from "./BigCard.styles";


interface BigCardProps {
	children?: ReactNode;
	title?: string;
}

const BigCard = ({ children, title }: BigCardProps): ReactElement => (
	<Container>
		<Header>
			<Title>{title}</Title>
		</Header>
		{children}
	</Container>
);

export default BigCard;