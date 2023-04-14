import Tooltip from 'rc-tooltip';

interface Props {
  id: string;
  title: string | JSX.Element;
  placement?: string;
  children: JSX.Element;
}

function TooltipComponent({id, title, placement = 'bottom', children}: Props) {
  return (
    <Tooltip id={id} placement={placement} overlay={<span>{title}</span>}>
      {children}
    </Tooltip>
  );
}

export default TooltipComponent;
