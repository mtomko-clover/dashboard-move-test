import styled from "styled-components";

export const AnnouncementContainer = styled.div`
     box-shadow: ${({ theme }): string => theme.boxShadow};
     display: flex;
     flex-direction: row;
     background: white;
     margin: 15px 40px;
     padding: 20px;
     align-items: center;
     border-radius: 5px;
`;

export const AnnouncementText = styled.div`
     font-size: 18px;
     font-style: bold;
`;

export const AnnouncementBullhornIcon = styled.i`
      margin-right: 30px;
      color: #2AAFDD
`;

export const AnnouncementExclamationIcon = styled.i`
      margin-right: 30px;
      margin-left:10px;
      color: #EA2C2F
`;

export const AnnouncementDelete = styled.i`
   margin-left: 20px;
   color: rgba(0, 0, 0, 0.45);
`;

export const EditRow = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
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
        font-size: 12px;
        font-style: bold;
        padding: 5px;
        flex-grow: 1;
        border: 1px solid #d9d9d9;
`;

export const CategoryRow = styled.input`

    `;