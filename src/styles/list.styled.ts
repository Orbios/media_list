import styled from 'styled-components';

import {Button} from '@/components/bootstrap';

import {colors, mediaQueries} from '@/styles/shared';

export const listContainer = styled.div`
  background-color: ${colors.grayLight};

  @media ${mediaQueries.tablet} {
    padding: 10px 20px;
  }
`;

export const noItems = styled.div`
  margin-top: 30px;
`;

export const itemRow = styled.div`
  font-size: 15px;
  padding: 10px;
  margin-left: 0;
  margin-right: 0;
  border-bottom: 1px solid #cacaca;
  position: relative;
  display: flex;
  width: 100%;

  @media ${mediaQueries.tablet} {
    padding: 10px 0;
  }
`;

export const itemContent = styled.div`
  font-size: 12px;
  margin-left: 10px;
  text-align: left;
  font-family: Verdana, Arial, sans-serif;
  color: #333;
  width: 100%;

  p span::before {
    content: ' | ';
    color: #ddd;
  }
`;

export const itemHeader = styled.h3`
  font-size: 17px;
  margin: 0;
`;

export const actionLink = styled(Button)`
  color: ${colors.link};
  text-decoration: none;
  padding: 0;
  margin: 0;
  width: 100%;
  text-align: left;

  @media ${mediaQueries.tablet} {
    width: auto;
  }
`;

export const actionButton = styled(Button)`
  float: right;
  margin-left: 5px;
  color: black;
`;

export const itemInfo = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const contributors = styled.p`
  margin-top: 8px;
  color: ${colors.link};
`;
