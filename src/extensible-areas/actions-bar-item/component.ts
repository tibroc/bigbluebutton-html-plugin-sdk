import { ActionsBarPosition, ActionsBarItemType } from './enums';
import {
  ActionsBarInterface, ActionsBarButtonProps, ActionsBarSeparatorProps,
} from './types';

// ActionsBar Extensible Area

export class ActionsBarButton implements ActionsBarInterface {
  id: string = '';

  type: ActionsBarItemType;

  icon: string;

  tooltip: string;

  position: ActionsBarPosition;

  onClick: () => void;

  /**
   * Returns object to be used in the setter for action bar. In this case,
   * a button.
   *
   * @param icon - icon to be used in the button for the action bar
   * @param tooltip - tooltip to be displayed when hovering the button
   * @param onClick - function to be called when clicking the button
   * @param position - position that this button will be displayed, see {@link ActionsBarPosition}
   *
   * @returns Object that will be interpreted by the core of Bigbluebutton (HTML5)
   */
  constructor({
    id, icon = '', tooltip = '', onClick = () => {}, position = ActionsBarPosition.RIGHT,
  }: ActionsBarButtonProps) {
    if (id) {
      this.id = id;
    }
    this.icon = icon;
    this.tooltip = tooltip;
    this.onClick = onClick;
    this.position = position;
    this.type = ActionsBarItemType.BUTTON;
  }

  setItemId: (id: string) => void = (id: string) => {
    this.id = `ActionsBarButton_${id}`;
  };
}

export class ActionsBarSeparator implements ActionsBarInterface {
  position: ActionsBarPosition;

  id: string = '';

  type: ActionsBarItemType;

  /**
   * Returns object to be used in the setter for action bar. In this case,
   * a separator.
   *
   * @param position - position that this button will be displayed, see {@link ActionsBarPosition}
   *
   * @returns Object that will be interpreted by the core of Bigbluebutton (HTML5)
   */
  constructor({
    position = ActionsBarPosition.RIGHT,
  }: ActionsBarSeparatorProps) {
    this.position = position;
    this.type = ActionsBarItemType.SEPARATOR;
  }

  setItemId: (id: string) => void = (id: string) => {
    this.id = `ActionsBarSeparator_${id}`;
  };
}
