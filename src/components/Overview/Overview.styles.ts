import styled from "styled-components";

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 10px;
`;

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 100%;
    max-width: 1400px;
`;

export const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 29px 0 55px;
    width: 100%;
    max-width: 1400px;

    h2 {
        font-size: 18px;
        font-weight: 900;
        color: #283338;
    }

    .ant-input {
        font-family: Maison Mono !important;
        font-weight: 400;
        font-size: 12px;
    }

    .ant-calendar-picker-icon {
        margin-top: -10px !important;
    }
`;