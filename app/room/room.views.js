class RoomView {
  constructor({ id, name, max, status, Users, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.max = max;
    this.status = status;
    this.Users = Users;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  #mapPlayer(players) {
    return players.map((player) => {
      return {
        player: player.id,
        username: player.username,
        type: player.UserRooms.playerType,
      };
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      max_player: this.max,
      players: this.#mapPlayer(this.Users),
    };
  }
}

module.exports = RoomView;
