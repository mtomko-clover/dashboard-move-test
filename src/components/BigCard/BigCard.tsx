import React, {ReactNode} from "react";

import {Container, Header, Title} from "./BigCard.styles";


interface BigCardProps {
	children?: ReactNode
	title?: string
}

const BigCard = ({ children, title }: BigCardProps) => (
	<Container>
		<Header>
			<Title>{title}</Title>
		</Header>
		{children}
	</Container>
)

export default BigCard