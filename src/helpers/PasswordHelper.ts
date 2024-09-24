import * as bcrypt from 'bcrypt';

export class PasswordHelper {
  static async generatePassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(inputPassword: string, prevPassword: string) {
    return await bcrypt.compare(inputPassword, prevPassword);
  }
}
