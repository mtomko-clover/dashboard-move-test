import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    height: 550px;
    padding: 0;
    margin: 0 19px;
    border: none;
    border-radius: 5px;
    background: white;
    box-shadow: ${({ theme }) => theme.boxShadow};
`;

export const Header = styled.div`
    width: 100%;
    height: 70px;
    padding: 22px 25px; 
    border-bottom: 1px solid #E9E9E9;
`;

export const Title = styled.h2`
    font-size: 18px;
    font-weight: 900;
`;