import { action, configure, observable, runInAction } from "mobx"
import { TarihiStringeCevir } from "../Utilities/GenelFonksiyonlar"
import axios from "axios"
import Holidays from "date-holidays"

configure({
    enforceActions: "observed"
})

class AppStore {
    //#region Stateler
    @observable loadingPopupAcikMi = true
    @observable hataMesajiPopupMesaj = ""
    @observable hataMesajiPopupAcikMi = false

    @observable dovizlerListesi: any = {}
    @observable kriptoParalarListesi: any = {}
    //#endregion

    //#region LoadingPopupAcKapa, HataMesajiPopupAcKapa
    @action LoadingPopupAcKapa = (acikMi: boolean) => {
        this.loadingPopupAcikMi = acikMi
    }
    @action HataMesajiPopupAcKapa = (acikMi: boolean, hataMesaj?: string) => {
        this.hataMesajiPopupAcikMi = acikMi
        this.hataMesajiPopupMesaj = hataMesaj!
    }
    //#endregion

    //#region ParalariGetir, KriptoParalariGetir, DovizGetirmeIslemiIcinTarihBul
    @action DovizleriGetir = async () => {
        try {
            const gununTarihi = await this.DovizGetirmeIslemiIcinTarihBul()

            const dovizlerSonuc = await axios.get(`https://evds2.tcmb.gov.tr/service/evds/series=TP.DK.USD.S-TP.DK.EUR.S&startDate=${gununTarihi}&endDate=${gununTarihi}&type=json&key=OUOWPKExMb`)

            if (dovizlerSonuc.status === 200) {
                runInAction(() => {
                    this.dovizlerListesi = dovizlerSonuc.data
                })
            }
            else {
                this.HataMesajiPopupAcKapa(true, "Döviz bilgilerini getirirken bir hata oluştu.")
            }
        } catch (error) {
            this.HataMesajiPopupAcKapa(true, error.message)
        }
    }
    @action KriptoParalariGetir = async () => {
        try {
            const kriptoParalarSonuc = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,DOGE&convert=TRY", { headers: { "X-CMC_PRO_API_KEY": "23e0d3d1-41ae-43a0-87e3-57b4d2764bc6" } })

            if (kriptoParalarSonuc.status === 200) {
                runInAction(() => {
                    this.kriptoParalarListesi = kriptoParalarSonuc.data.data
                })
            }
            else {
                this.HataMesajiPopupAcKapa(true, "Kripto paraları getirirken bir hata oluştu.")
            }
        } catch (error) {
            this.HataMesajiPopupAcKapa(true, error.message)
        }
    }
    @action DovizGetirmeIslemiIcinTarihBul = async () => {
        // Tatil günlerinde merkez bankası veri göndermediği için bu metod ile tatilden bir önceki günü buluyoruz.
        let gununTarihi = await TarihiStringeCevir(new Date())
        let yilOncelikliGununTarihi = await TarihiStringeCevir(new Date(), true)

        let tarih = new Date(yilOncelikliGununTarihi)
        let gunHaftaninKacinciGunu = tarih.getDay()
        const hd = new Holidays("TR")
        let resmiTatilMi = hd.isHoliday(new Date(yilOncelikliGununTarihi))

        if (gunHaftaninKacinciGunu === 6) {
            tarih.setDate(tarih.getDate() - 1)
            gununTarihi = await TarihiStringeCevir(new Date(tarih))
        }
        else if (gunHaftaninKacinciGunu === 0) {
            tarih.setDate(tarih.getDate() - 2)
            gununTarihi = await TarihiStringeCevir(new Date(tarih))
        }
        else if (resmiTatilMi !== false) {
            for (let i = 1; ; i++) {
                tarih.setDate(tarih.getDate() - i)
                yilOncelikliGununTarihi = await TarihiStringeCevir(new Date(tarih), true)
                resmiTatilMi = hd.isHoliday(new Date(`${yilOncelikliGununTarihi} 00:00:00 GMT+0000`))

                if (resmiTatilMi === false) {
                    break
                }
            }
        }

        return gununTarihi
    }
    //#endregion
}

export default new AppStore()