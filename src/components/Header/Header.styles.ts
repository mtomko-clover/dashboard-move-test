import styled from "styled-components";

export const HeaderContainer = styled.header`
	display: grid;
	grid-template-columns: 45px 200px 1fr 100px;
	align-items: center;
	padding: 20px;
	width: 100%;
	background: ${({ theme }): string => theme.headerBackground};

	a.header_title {
		font-size: 20px;
		font-weight: bold;
		text-decoration: none;
		color: white;
	}

  a.header_link {
    text-decoration: none;
    padding: 10px;
    font-size: 18px;
    font-weight: bold;
    color: white
  }

	img {
		height: 30px;
		margin-right: 15px;
		filter: grayscale(1) brightness(1) contrast(10);
	}
`;

export const LogoutButton = styled.button`
	padding: 10px;
	border-radius: 5px;
`;
