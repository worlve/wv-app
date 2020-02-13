import React, { ReactElement } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import EditIcon from '@material-ui/icons/Edit';
import DetailsIcon from '@material-ui/icons/Details';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(4),
    },
  }),
);

export interface CastPageActionsAction {
  key: string;
  icon: React.ReactElement;
  tooltip: string;
}

export interface CastPageActionsProps {
  hidden?: boolean;
  actions: CastPageActionsAction[];
  defaultActionKey: string;
  onActionSelect?: (onSelectKey: string) => void;
}

const CastPageActions = (props: CastPageActionsProps):ReactElement => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (onSelectKey?: string) => {
    if (props.onActionSelect && onSelectKey) {
      props.onActionSelect(onSelectKey);
    }
    setOpen(false);
  };

  return (
    <SpeedDial
      className={classes.speedDial}
      ariaLabel="SpeedDial openIcon CastPageActions"
      icon={<SpeedDialIcon icon={<DetailsIcon />} openIcon={<EditIcon />} />}
      onClose={() => handleClose(props.defaultActionKey)}
      onOpen={handleOpen}
      open={open}
      hidden={props.hidden}
    >
      {props.actions.map(action => (
        <SpeedDialAction
          key={action.key}
          icon={action.icon}
          tooltipTitle={action.tooltip}
          onClick={() => handleClose(action.key)}
        />
      ))}
    </SpeedDial>
  );
}

export default CastPageActions;
