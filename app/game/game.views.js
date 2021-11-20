class GameView {
  constructor({
    id,
    name,
    playerOnePoint,
    playerTwoPoint,
    winner,
    isActive,
    Users,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.playerOnePoint = playerOnePoint;
    this.playerTwoPoint = playerTwoPoint;
    this.winner = winner;
    this.isActive = isActive;
    this.Users = Users;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  #mapUser(users) {
    return users.map((user) => {
      return {
        username: user.username,
        player_choice: user.UserRounds.playerChoice,
      };
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      player_one_point: this.playerOnePoint,
      player_two_point: this.playerTwoPoint,
      winner: this.winner,
      is_active: this.isActive,
      users: this.#mapUser(this.Users),
    };
  }
}

module.exports = GameView;
