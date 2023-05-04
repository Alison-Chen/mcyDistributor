const numberToCurrency = (num: number) => {
  return new Intl.NumberFormat("en").format(num)
}

export default numberToCurrency
