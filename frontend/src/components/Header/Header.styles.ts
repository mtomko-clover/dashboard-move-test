import styled from "styled-components";

export const HeaderContainer = styled.header`
	display: grid;
	grid-template-columns: 45px 1fr 325px;
	align-items: center;
	padding: 20px;
	width: 100%;
	background: ${({ theme }): string => theme.headerBackground};

	#logo {
		height: 30px;
		margin-right: 15px;
		filter: grayscale(1) brightness(1) contrast(10);
	}

	a.header-title {
		font-size: 20px;
		font-weight: bold;
		text-decoration: none;
		color: white;
	}

	a.header-link {
		text-decoration: none;
		padding: 10px;
		font-size: 18px;
		font-weight: bold;
		color: white;
	}

	.header-dropdown {
		width: 100%;
		justify-content: flex-end;
	}
`;

export const UsernameContainer = styled.a`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

export const FullNameContainer = styled.div`
	font-weight: 500;
	color: white;
	font-size: 20px;
	justify-content: flex-end;
`;

export const ProfilePictureContainer = styled.img`
	border-radius: 50%;
	object-fit: cover;
	object-position: 100% 0;
	margin-right: 10px;
	height: 40px;
	width: 40px;
`;

export const LogoutButton = styled.div`
	color: white;
	text-align: right;
	font-weight: bold;
`;

export const MenuItemRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center
	justify-content: flex-start;

	i {
		margin-right: 10px;
	}
`;