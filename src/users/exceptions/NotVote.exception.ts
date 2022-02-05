export class NotVoteException {
  constructor(readonly message: string) {}

  private throw() {
    return this.message
  }
}
