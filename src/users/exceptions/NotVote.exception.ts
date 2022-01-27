export class NotVoteException {
  constructor(readonly message: string) {}

  throw() {
    return this.message
  }
}
