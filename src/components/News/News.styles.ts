import styled from "styled-components";

// News
export const NewsItems = styled.div`
    width: 100%;
`;

export const Heading = styled.div`
    display: grid;
    grid-template-columns: 10% 70% 20%;
    width: 100%;
    padding: 20px 10px;
    background-color: #FAFAFA;
`;

export const Date = styled.div`
    padding-left: 20px;
    font-size: 14px;
    font-weight: 900;
`;

export const Title = styled.div`
    grid-column-start: 2;
    font-size: 14px;
    padding-left: 20px;
    font-weight: 900;
`;

export const Type = styled.div`
    grid-column-start: 3;
    font-size: 14px;
    font-weight: 900;
`;

// NewsUpdateRow
export const Row = styled.div`
    display: grid;
    grid-template-columns: 10% 70% 20%;
    padding: 10px;
    border-bottom: 1px solid #E8E8E8;
`;

export const RowDate = styled.div`
    padding-left: 20px;
    margin-top: 4px;
    font-family: Maison Mono;
    font-size: 12px;
`;

export const RowTitle = styled.div`
    grid-column-start: 2;
    white-space: nowrap;
    width: 100%;                   /* IE6 needs any width */
    overflow: hidden;              /* "overflow" value must be different from  visible"*/ 
    -o-text-overflow: ellipsis;    /* Opera < 11*/
    text-overflow:    ellipsis; 
    font-size: 16px;
    padding-left: 20px;
    color: ${({ theme }): string => theme.linkDark};
`;

export const RowType = styled.div`
    grid-column-start: 3;
    margin-top: 4px;
    font-family: Maison Mono;
    font-size: 12px;
`;