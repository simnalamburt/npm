declare module 'slm' {
  function compile(
    src: string,
    options: object,
    vm?: any
  ): (model: object) => string
}
