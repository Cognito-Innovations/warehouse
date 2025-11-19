export const numberInputStyle = {
  '& input[type=number]': {
    MozAppearance: 'textfield', // Firefox
  },
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none', // Chrome, Safari, Edge
    margin: 0,
  },
};