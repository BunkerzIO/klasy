class Uzytkownik {
  #email;
  #nickname;
  #haslo;
  #isBanned = false;
  #isAdmin = false;
  #isTester = false;

  constructor(email, nickname, haslo) {
    this.#email = email;
    this.#nickname = nickname;
    this.#haslo = haslo;
  }

  // ===== Gettery =====
  get email() {
    return this.#email;
  }

  get nickname() {
    return this.#nickname;
  }

  get haslo() {
    return this.#haslo;
  }

  get isBanned() {
    return this.#isBanned;
  }

  get isAdmin() {
    return this.#isAdmin;
  }

  get isTester() {
    return this.#isTester;
  }

  // ===== Settery =====
  set email(value) {
    this.#email = value;
  }

  set nickname(value) {
    this.#nickname = value;
  }

  set haslo(value) {
    this.#haslo = value;
  }

  set isBanned(value) {
    this.#isBanned = value;
  }

  set isAdmin(value) {
    this.#isAdmin = value;
  }

  set isTester(value) {
    this.#isTester = value;
  }
}
