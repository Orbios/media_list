import {Container} from '@/components/bootstrap';

import * as styled from './PageWrapper.styled';

interface Props {
  title?: string;
  children: any;
}

function PageWrapper({title, children}: Props) {
  if (title) {
    return (
      <styled.wrapperWithTitle>
        <h2>{title}</h2>

        <styled.content>{children}</styled.content>
      </styled.wrapperWithTitle>
    );
  }

  return (
    <styled.wrapper>
      <Container>{children}</Container>
    </styled.wrapper>
  );
}

export default PageWrapper;
