class BiodataViews {
  constructor({
    id,
    fullname,
    email,
    age,
    gender,
    imgUrl,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.age = age;
    this.gender = gender;
    this.imgUrl = imgUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      fullname: this.fullname,
      email: this.fullname,
      age: this.age,
      gender: this.gender,
      img_url: this.imgUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

module.exports = BiodataViews;
