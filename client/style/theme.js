import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

export default {
  // fontFamily: 'Raleway, sans-serif',
  palette: {
    primary1Color: '#555273',
    primary2Color: Colors.pink500,
    primary3Color: Colors.lightBlack,
    accent1Color: '#65799B',
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.darkBlack,
    alternateTextColor: '#FFF',
    canvasColor: '#E2EFF1',
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.lime500,
  }
};
