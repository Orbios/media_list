import styled from 'styled-components';

import {colors} from '@/styles/shared';

export const searchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const scrollableContainer = styled.div`
  height: 325px;
  overflow-y: scroll;
  margin-bottom: 20px;
`;

export const entityItem = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid ${colors.darkGray};
`;

export const entityContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 10px;
  width: 100%;
`;
