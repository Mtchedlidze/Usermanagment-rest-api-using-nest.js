import { pbkdf2, randomBytes } from 'crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HashPassword {
  private passowrd: string
  private salt: string

  async hash(
    password: string,
    salt?: string
  ): Promise<{ password: string; salt: string }> {
    if (!password) {
      return
    }
    salt = salt || randomBytes(16).toString('hex')
    return new Promise((resolve, reject) => {
      const iterations = 50000
      const keylen = 16
      const digest = 'sha512'

      pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
        if (err) {
          reject({
            error: err,
          })
        } else {
          resolve({
            password: key.toString('hex'),
            salt: salt,
          })
        }
      })
    })
  }
}
