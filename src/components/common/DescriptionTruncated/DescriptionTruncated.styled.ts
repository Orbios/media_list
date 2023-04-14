import styled from 'styled-components';

import {Button} from '@/components/bootstrap';

export const text = styled.p`
  overflow: hidden;
  position: relative;
  line-height: 1.4em;
  text-align: justify;
  padding-right: 1.2em;
  font-size: 14px;
  margin-bottom: 0;
`;

export const toggler = styled(Button)`
  padding-top: 0;
  padding-bottom: 0;
  color: black;
`;
