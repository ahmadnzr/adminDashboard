const { PLAYER_ONE, PLAYER_TWO } = require("../../utils/gameChoiceConst");

class GameView {
  constructor({
    id,
    name,
    max,
    winner,
    isActive,
    playerOnePoint,
    playerTwoPoint,
    createdAt,
    updatedAt,
    Users,
    Rounds,
  }) {
    this.id = id;
    this.name = name;
    this.max = max;
    this.winner = winner;
    this.playerOnePoint = playerOnePoint;
    this.playerTwoPoint = playerTwoPoint;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.Users = Users;
    this.Rounds = Rounds;
  }

  #mapUsers(users) {
    return users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        type: user.UserRooms.playerType,
        is_winner: user.UserRooms.isWinner,
      };
    });
  }

  #playerOne(users) {
    return users.find((user) => user.UserRooms.playerType === PLAYER_ONE);
  }

  #playerTwo(users) {
    return users.find((user) => user.UserRooms.playerType === PLAYER_TWO);
  }

  #findUserChoice(users, userId) {
    return users.find((user) => user.id === userId);
  }

  #mapRounds(rounds) {
    return rounds.map((round) => {
      return {
        name: round.name,
        winner: round.winner,
        player_one_point: round.playerOnePoint,
        player_two_point: round.playerTwoPoint,
        player_one_choice: this.#findUserChoice(
          round.Users,
          this.#playerOne(this.Users).id
        ).UserRounds.playerChoice,
        player_two_choice: this.#findUserChoice(
          round.Users,
          this.#playerTwo(this.Users).id
        ).UserRounds.playerChoice,
      };
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      max_player: this.max,
      player_one_score: this.playerOnePoint,
      player_two_score: this.playerTwoPoint,
      winner: this.winner,
      isActive: this.isActive,
      created_at: this.createdAt,
      finished_at: this.updatedAt,
      users: this.#mapUsers(this.Users),
      rounds: this.#mapRounds(this.Rounds),
    };
  }
}

module.exports = GameView;
