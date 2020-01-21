import styled from 'styled-components';

export const BigRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 19px;
  height: 588px;
  flex-shrink: 0;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  padding: 19px;
  height: 171px;
  flex-shrink: 0;

  .weekly-digest {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 133px;
  }
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
  width: 50%;
  max-width: 1400px;
  min-width: 690px;
  flex-shrink: 0;

  h2 {
    font-size: 18px;
    font-weight: 900;
    color: #283338;
  }

  .ant-btn-group {
    span {
      text-align: left;
      width: 180px;
      margin-top: -1px;
      font-family: Maison Mono !important;
      font-weight: 400;
      font-size: 12px;
    }
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
