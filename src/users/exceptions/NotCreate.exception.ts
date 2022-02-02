export class NotCreateException {
  constructor(readonly message: string) {}

  throw() {
    return this.message
  }
}
