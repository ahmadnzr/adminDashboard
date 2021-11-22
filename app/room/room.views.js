class RoomView {
  constructor({
    id,
    name,
    max,
    isActive,
    winner,
    Users,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.max = max;
    this.isActive = isActive;
    this.winner = winner;
    this.Users = Users;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  #mapPlayer(players) {
    return players.map((player) => {
      return {
        id: player.id,
        username: player.username,
        type: player.UserRooms.playerType,
        is_winner: player.UserRooms.isWinner,
      };
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      isActive: this.isActive,
      max_player: this.max,
      winner: this.winner,
      players: this.#mapPlayer(this.Users),
    };
  }
}

module.exports = RoomView;
