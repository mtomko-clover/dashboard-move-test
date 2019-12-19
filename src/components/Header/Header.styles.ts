import styled from 'styled-components'

export const HeaderContainer = styled.header`
  display: grid;
  background: ${({ theme }) => theme.headerBackground};
  padding: 20px;
  align-items: center;
  grid-template-columns: 45px 200px 1fr 100px;

  a.header_title {
    font-size: 20px;
    font-weight: bold;
    text-decoration: none;
    color: white;
  }

  a.time_tracking {
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
`

export const LogoutButton = styled.button`
  padding: 10px;
  border-radius: 5px;
`;
