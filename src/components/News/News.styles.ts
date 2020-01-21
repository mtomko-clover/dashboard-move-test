import styled from "styled-components";

// News.tsx
export const Heading = styled.div`
	display: grid;
	grid-template-columns: 56px 1fr 85px;
	width: 100%;
	padding: 20px 10px;
	background-color: #fafafa;
`;

export const Date = styled.div`
	padding-left: 20px;
	font-size: 14px;
	font-weight: 900;
`;

export const Title = styled.div`
	grid-column-start: 2;
	font-size: 14px;
	padding: 0 20px 0 20px;
	font-weight: 900;
`;

export const Type = styled.div`
	grid-column-start: 3;
	font-size: 14px;
	font-weight: 900;
	text-align: right;
	padding-right: 20px;
`;

// Row.tsx
export const Row = styled.div`
	display: grid;
	grid-template-columns: 56px 1fr 85px;
	width: 100%;
`;

export const RowDate = styled.div`
	padding-left: 20px;
	margin-top: 4px;
	font-family: Maison Mono;
	font-size: 12px;
`;

export const RowTitle = styled.div`
	box-sizing: content-box;
	grid-column-start: 2;
	white-space: nowrap;
	overflow: hidden;
	-o-text-overflow: ellipsis;
	text-overflow: ellipsis;
	font-size: 16px;
	padding: 0 20px 0 20px;
	color: ${({ theme }): string => theme.linkDark};
`;

export const RowType = styled.div`
	grid-column-start: 3;
	margin-top: 4px;
	font-family: Maison Mono;
	font-size: 12px;
	text-align: right;
	padding-right: 20px;
`;

export const EditRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 10px;
	width: 250px;
`;

export const EditColumn = styled.div`
	padding: 10px;
	display: flex;
	flex-direction: column;
	align-items: flext-start;
`;

export const EditLabel = styled.div`
	font-size: 16px;
	font-style: bold;
	margin-right: 10px;
`;

export const EditInput = styled.input`
	padding: 10px;
	flex-grow: 1;
	border: 1px solid #d9d9d9;
	border-radius: 5px;
	font-family: "Maison Mono";
	font-size: 14px;
	font-style: bold;
`;

export const TextAreaInput = styled.textarea`
	height: 100px;
	border: 1px solid #d9d9d9;
	border-radius: 5px;
	padding: 10px;
	font-family: "Maison Mono";
	font-size: 14px;
	font-style: bold;
`;

export const ViewRow = styled.div`
	display: flex;
	flex-direction: row;
	padding-top: 20px;
`;

export const ViewKey = styled.div`
	font-size: 12px;
	font-style: bold;
	margin-right: 10px;
`;

export const ViewCategory = styled.div`
	font-size: 12px;
	font-style: bold;
	font-family: Maison Mono;
`;

export const ViewDescription = styled.div`
	font-size: 14px;
	padding: 15px 0px;
`;

export const ViewTitle = styled.div`
	font-size: 18px;
	font-style: bold;
	text-align: left;
`;

export const UsernameContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

export const FullNameContainer = styled.div`
	font-weight: 500;
	font-size: 12px;
	justify-content: flex-end;
`;

export const ProfilePictureContainer = styled.img`
	border-radius: 50%;
	object-fit: cover;
	object-position: 100% 0;
	margin-right: 10px;
	height: 25px;
	width: 25px;
`;
