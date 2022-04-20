export class NotCreateException {
  constructor(readonly message: string) {}

  private throw() {
    return this.message
  }
}
