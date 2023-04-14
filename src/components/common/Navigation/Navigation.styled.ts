import styled from 'styled-components';

import {Button} from '@/components/bootstrap';

import {sideNavWidth} from '@/styles/shared';

const backgroundColor = '#2a2229';

export const wrapper = styled.div`
  background-color: ${backgroundColor};
  width: ${sideNavWidth};
  position: absolute;
  top: 0;
  bottom: 0;
`;

export const container = styled.ul`
  list-style: none;
  padding: 35px 15px;
  margin: 0;
`;

export const item = styled.li`
  padding-bottom: 15px;
`;

export const action = styled(Button)`
  user-select: none;
  font-size: 2rem;
  color: #555;
  background-color: ${backgroundColor};

  &:hover {
    color: #52affb;
    background-color: ${backgroundColor};
  }
`;
