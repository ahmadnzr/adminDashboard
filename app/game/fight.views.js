class FightView {
  constructor({ id, roomId, name, Users, isActive }) {
    this.id = id;
    this.roomId = roomId;
    this.name = name;
    this.Users = Users;
    this.isActive = isActive;
  }

  #mapUsers(users) {
    return users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        choice: user.UserRounds.playerChoice,
      };
    });
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      room_id: this.roomId,
      isActive: this.isActive,
      users: this.#mapUsers(this.Users),
    };
  }
}

module.exports = FightView;
