import styled from 'styled-components';

import {colors, posterWidth, posterHeight} from '@/styles/shared';

export const container = styled.div`
  display: flex;
  background-color: #eee;
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-width: ${posterWidth}px;
  height: ${posterHeight}px;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  cursor: pointer;

  :hover {
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
  }
`;

export const hoverContainer = styled.div`
  color: ${colors.white};
`;
