const db = require("../data/database");
const bcrypt = require("bcryptjs");

class Account {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  static async getAccountByEmail(email) {
    const account = await db
      .getDb()
      .collection("users")
      .findOne({ email: email });
    if (!account) {
      return;
    }
    return new Account(account.email, account.password);
  }

  async save() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    await db
      .getDb()
      .collection("users")
      .insertOne({ email: this.email, password: hashedPassword });
  }

  static async performLogin(email, password) {
    const existingUser = await this.getAccountByEmail(email);

    if (!existingUser) {
      return;
    }
    const passwordsAreEqual = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordsAreEqual) {
      return;
    }
    return existingUser;
  }
}

module.exports = Account;
