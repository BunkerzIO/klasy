class Gracz extends Uzytkownik{
    id_gracza;
    id_pokoju;
    isHost;
    cechy;
    głos;
    is_kicked;

    constructor(id_gracza, id_pokoju, isHost = false) {
        this.id_gracza = id_gracza;
        this.id_pokoju = id_pokoju;
        this.isHost = isHost;
        this.cechy = [];
        this.głos = null;
        this.is_kicked = false;
    }

    głosować(id_uzytkownika_na_ktorego_glosuje) {
    }

    ujawnić_cechę(cecha_do_ujawnienia) {
    }

    użyć_umiejętności(umiejetnosc, cel) {
    }
}