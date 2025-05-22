class Pokoj {
    #id_pokoju;
    #id_hosta = false;
    #stan_gry = false;
    #tura;
    #gracze_w_pokoju = [];
    #informacje_o_grze;
    #stan_glosowania = false;

    constructor(Gracze) {
        this.#gracze_w_pokoju = Gracze;
        this.#id_hosta = Gracze[0];
        this.#tura = 0;
    }

    // Gettery
    get id_pokoju() {
        return this.#id_pokoju;
    }

    get id_hosta() {
        return this.#id_hosta;
    }

    get stan_gry() {
        return this.#stan_gry;
    }

    get tura() {
        return this.#tura;
    }

    get gracze_w_pokoju() {
        return this.#gracze_w_pokoju;
    }

    get informacje_o_grze() {
        return this.#informacje_o_grze;
    }

    get stan_glosowania() {
        return this.#stan_glosowania;
    }

    // Settery
    set id_pokoju(value) {
        this.#id_pokoju = value;
    }

    set id_hosta(value) {
        this.#id_hosta = value;
    }

    set stan_gry(value) {
        this.#stan_gry = value;
    }

    set tura(value) {
        this.#tura = value;
    }

    set gracze_w_pokoju(value) {
        this.#gracze_w_pokoju = value;
    }

    set informacje_o_grze(value) {
        this.#informacje_o_grze = value;
    }

    set stan_glosowania(value) {
        this.#stan_glosowania = value;
    }
}