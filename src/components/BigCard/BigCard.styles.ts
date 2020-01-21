import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 550px;
	padding: 0;
	margin: 0 19px;
	border: none;
	border-radius: 5px;
	background: white;
	box-shadow: ${({ theme }): string => theme.boxShadow};
`;

export const Header = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 100%;
	height: 70px;
	padding: 18px 25px;
	border-bottom: 1px solid #e9e9e9;

	h2 {
		margin: 2px 0 0 0;
	}

	.ant-input {
		width: 250px;
		font-family: Maison Mono !important;
		font-weight: 400;
		font-size: 12px;
	}

	.ant-calendar-picker-icon {
		margin-top: -7px !important;
	}
`;

export const Title = styled.h2`
	font-size: 18px;
	font-weight: 900;
`;
