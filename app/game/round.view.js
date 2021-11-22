class RoundView {
  constructor({
    id,
    roomId,
    name,
    playerOnePoint,
    playerTwoPoint,
    winner,
    Users,
    isActive,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.roomId = roomId;
    this.playerOnePoint = playerOnePoint;
    this.playerTwoPoint = playerTwoPoint;
    this.name = name;
    this.winner = winner;
    this.Users = Users;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
      player_one_point: this.playerOnePoint,
      player_two_point: this.playerTwoPoint,
      winner: this.winner,
      isActive: this.isActive,
      created_at: this.createdAt,
      finished_at: this.updatedAt,
      users: this.#mapUsers(this.Users),
    };
  }
}

module.exports = RoundView;
