export const SayiyiUstGostergesiOlmadanHesapla = (sayi: number, virgulSonrasiBasamakSayisi: number) => {
    sayi = Number(sayi.toFixed(virgulSonrasiBasamakSayisi))
    var data = String(sayi).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = '', sign = sayi < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
}

/**
 * Vermiş olduğunuz tarihi GG-AA-YYYY formatında string olarak geri döner. Örneğin: 11-09-2020. NOT: Offset zamanı sıfırlanarak işlem yapılır.
 * @param tarih Dönüştürülecek tarihi verin.
 */

/**
 * @param yilAyGunMu = Eğer burası true gönderilirse YYYY-AA-GG formatında gönderilir. False veya undefined gönderilse eğer GG-AA-YYYY şeklinde geriye dönüş yapar
 */
export const TarihiStringeCevir = async (tarih: Date, yilAyGunMu?: boolean) => {
    let tarih1 = tarih
    let yil = tarih1.getFullYear()
    let ay = tarih1.getMonth()
    let gun = tarih1.getDate()

    tarih1 = new Date(Date.UTC(yil, ay, gun, tarih1.getTimezoneOffset() / 60))
    yil = tarih1.getFullYear()
    ay = tarih1.getMonth()
    gun = tarih1.getDate()

    if (yilAyGunMu) {
        return yil + "-" + ((ay + 1).toString().length === 1 ? "0" + (ay + 1) : (ay + 1)) + "-" + (gun.toString().length === 1 ? "0" + gun : gun)
    }
    else {
        return (gun.toString().length === 1 ? "0" + gun : gun) + "-" + ((ay + 1).toString().length === 1 ? "0" + (ay + 1) : (ay + 1)) + "-" + yil
    }
}

export const SayiyiBasamaklaraAyir = (sayi) => {
    var parts = sayi.toString().split(",");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
}