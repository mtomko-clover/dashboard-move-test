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
