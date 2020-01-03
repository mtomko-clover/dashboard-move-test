import styled from 'styled-components'

export const CardContainer = styled.div`
    display: grid;
    grid-template-rows: 47px 45px 42px;
    align-items: end;
    margin: 0 19px;
    padding: 0 24px;
    width: 190px;
    border: none;
    border-radius: 5px;
    background: white;
    box-shadow: ${({ theme }): string => theme.boxShadow};
`;

export const CardTitle = styled.h2`
    width: 100%;
    line-height: 0.98;
    padding: 0 0 2px 0;
    margin: 0;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    font-weight: 500;
    text-align: left; 
`

export const Datum = styled.div`
    width: 100%;
    padding: 0;
    color: #262626;
    font-family: Maison Mono;
    font-size: 30px;
`;

export const Stat = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
    border-top: 1px solid #E8E8E8;

    svg {
        color: ${({ theme }): string => theme.highlightLight};
        height: 12px;
        padding: 0 0 2px 0;
    }
`

export const StatTitle = styled.h2`
    margin: 0;
    padding: 0 8px 2px 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
`

export const StatDatum = styled.div`
    width: 100%;
    padding: 2px 0 0 0;
    color: #262626;
    font-family: Maison Mono;
    font-size: 14px;
`;
