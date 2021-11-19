class UserView {
  constructor({ id, username, biodata, role, createdAt, updatedAt }) {
    this.id = id;
    this.username = username;
    this.biodata = biodata;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      biodata: {
        fullname: this.biodata.fullname,
        email: this.biodata.email,
        age: this.biodata.age,
        gender: this.biodata.gender,
        imgUrl: this.biodata.imgUrl,
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = UserView;
