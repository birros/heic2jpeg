import { createMuiTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'

const theme = createMuiTheme({
  props: {
    MuiButton: {
      size: 'small',
    },
    MuiFilledInput: {
      margin: 'dense',
    },
    MuiFormControl: {
      margin: 'dense',
    },
    MuiFormHelperText: {
      margin: 'dense',
    },
    MuiIconButton: {
      size: 'small',
    },
    MuiInputBase: {
      margin: 'dense',
    },
    MuiInputLabel: {
      margin: 'dense',
    },
    MuiListItem: {
      dense: true,
    },
    MuiOutlinedInput: {
      margin: 'dense',
    },
    MuiFab: {
      size: 'small',
    },
    MuiTable: {
      size: 'small',
    },
    MuiTextField: {
      margin: 'dense',
    },
    MuiToolbar: {
      variant: 'dense',
    },
    MuiAppBar: {
      color: 'primary',
      style: {
        backgroundColor: grey[900],
      },
    },
  },
  overrides: {
    MuiIconButton: {
      sizeSmall: {
        marginLeft: 4,
        marginRight: 4,
        padding: 12,
      },
    },
  },
})

export default theme
