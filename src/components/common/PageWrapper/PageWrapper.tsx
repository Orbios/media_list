import * as styled from './PageWrapper.styled';

interface Props {
  title: string;
  children: any;
}

function PageWrapper({title, children}: Props) {
  return (
    <styled.wrapper>
      <h2>{title}</h2>

      <styled.content>{children}</styled.content>
    </styled.wrapper>
  );
}

export default PageWrapper;
