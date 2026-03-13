import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function TooltipButton({ tooltip, children, placement = 'top', ...props }) {
  const tooltipElement = (
    <Tooltip id={`tooltip-${tooltip}`}>{tooltip}</Tooltip>
  );

  return (
    <OverlayTrigger placement={placement} overlay={tooltipElement}>
      <Button {...props}>{children}</Button>
    </OverlayTrigger>
  );
}

export default TooltipButton;
