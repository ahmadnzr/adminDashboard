class AuthView {
  constructor({ id, username, role, token }) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.token = token;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      token: {
        access_token: this.token,
        refresh_token: "",
      },
    };
  }
}

module.exports = AuthView;
