import { CameraSettingsDropdownItemType } from './enums';
import {
  CameraSettingsDropdownInterface, CameraSettingsDropdownOptionProps,
} from './types';

// CameraSettingsDropdown Extensible Area

export class CameraSettingsDropdownOption implements CameraSettingsDropdownInterface {
  id: string = '';

  type: CameraSettingsDropdownItemType;

  label: string;

  icon: string;

  onClick: () => void;

  /**
   * Returns object to be used in the setter for the camera settings dropdown. In this case,
   * an option.
   *
   * @param label - label to be displayed in camera settings dropdown option.
   * @param icon - icon to be used in the option for the dropdown. It goes in the left side of it.
   * @param onClick - function to be called when clicking the button.
   *
   * @returns Object that will be interpreted by the core of Bigbluebutton (HTML5).
   */
  constructor({
    id, label = '', icon = '', onClick = () => {},
  }: CameraSettingsDropdownOptionProps) {
    if (id) {
      this.id = id;
    }
    this.label = label;
    this.icon = icon;
    this.onClick = onClick;
    this.type = CameraSettingsDropdownItemType.OPTION;
  }

  setItemId: (id: string) => void = (id: string) => {
    this.id = `CameraSettingsDropdownOption_${id}`;
  };
}

export class CameraSettingsDropdownSeparator implements CameraSettingsDropdownInterface {
  id: string = '';

  type: CameraSettingsDropdownItemType;

  /**
   * Returns object to be used in the setter for the camera settings dropdown. In this case,
   * a separator.
   *
   * @remarks
   * It will display a horizontal thin black line inside the dropdown.
   *
   * @returns Object that will be interpreted by the core of Bigbluebutton (HTML5)
   */
  constructor() {
    this.type = CameraSettingsDropdownItemType.SEPARATOR;
  }

  setItemId: (id: string) => void = (id: string) => {
    this.id = `CameraSettingsDropdownSeparator_${id}`;
  };
}
