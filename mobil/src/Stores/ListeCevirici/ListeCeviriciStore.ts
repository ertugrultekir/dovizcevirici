import { action, configure, observable, runInAction, toJS } from "mobx"
import { SayiyiBasamaklaraAyir, SayiyiUstGostergesiOlmadanHesapla } from '../../Utilities/GenelFonksiyonlar';

configure({
    enforceActions: "observed"
})

class ListeCeviriciStore {
    //#region Stateler
    @observable hataMesajiPopupAcikMi = false
    @observable hataMesajiPopupMesaj = ""
    @observable loadingPopupAcikMi = true

    @observable data: Array<any> = []
    dinamik = observable.map()
    @observable dovizlerApiCallSonuc: any = {}
    @observable kriptoParalarApiCallSonuc: any = {}
    //#endregion
    //#region Değişkenkler
    tumParalarListesi = {}
    //#endregion
    //#region OnChanges
    @action DinamikOnChange = (e, name) => {
        runInAction(() => {
            this.dinamik.set(name, e)
        })
        this.DovizHesapla(name, e)
    }
    //#endregion

    //#region HataMesajiPopupAcKapa,LoadingPopupAcKapa
    @action HataMesajiPopupAcKapa = (acikMi: boolean, hataMesaji?: string) => {
        this.hataMesajiPopupAcikMi = acikMi
        this.hataMesajiPopupMesaj = hataMesaji!
    }
    @action LoadingPopupAcKapa = (acikMi: boolean) => {
        this.loadingPopupAcikMi = acikMi
    }
    //#endregion

    //#region DovizleriAl, KriptoParalariAl
    @action DovizleriAl = async (dovizlerApiCallSonuc) => {
        this.dovizlerApiCallSonuc = dovizlerApiCallSonuc
    }
    @action KriptoParalariAl = async (kriptoParalarApiCallSonuc) => {
        this.kriptoParalarApiCallSonuc = kriptoParalarApiCallSonuc
    }
    //#endregion

    //#region DovizIlkYuklemeleriniYap, GorunecekDovizIsminiAyarla, Paralarin1TLKarsisindakiDegeriniBul
    @action DovizIlkYuklemeleriniYap = async () => {
        try {
            const dovizlerSonuc = this.dovizlerApiCallSonuc
            const kriptoParalarSonuc = this.kriptoParalarApiCallSonuc

            runInAction(() => {
                this.tumParalarListesi = dovizlerSonuc.items[0]
                delete this.tumParalarListesi["Tarih"]
                delete this.tumParalarListesi["UNIXTIME"]
            })

            const kriptoParaObjeleri = Object.keys(kriptoParalarSonuc)
            for (let i = 0; i < kriptoParaObjeleri.length; i++) {
                runInAction(() => {
                    this.tumParalarListesi = {
                        ...this.tumParalarListesi,
                        [kriptoParaObjeleri[i]]: kriptoParalarSonuc[kriptoParaObjeleri[i]].quote.TRY.price
                    }
                })
            }
            const test = await this.Paralarin1TLKarsisindakiDegeriniBul(this.tumParalarListesi)

            runInAction(() => {
                this.tumParalarListesi = test
            })

            //#region Tüm sonuçları diziye yerleştir
            //#region Türk Lirası ApiCall içerisinden gelmediği için bu kısımda el ile ekliyoruz.
            this.data.push(
                {
                    id: 1,
                    value: 1,
                    name: "TRY",
                    varsayilanIsim: "TRY"
                }
            )
            //#endregion

            const tumParalarinObjeleri = Object.keys(this.tumParalarListesi)
            for (let i = 0; i < tumParalarinObjeleri.length; i++) {
                this.data.push(
                    {
                        id: i + 2,
                        value: this.tumParalarListesi[tumParalarinObjeleri[i]],
                        name: await this.GorunecekDovizIsminiAyarla(tumParalarinObjeleri, i),
                        varsayilanIsim: tumParalarinObjeleri[i]
                    }
                )
            }
            //#endregion

            this.dinamik.set("txtMiktar1", "1")
            this.dinamik.set("lblMiktar1", "1")
            await this.DovizHesapla("txtMiktar1", 1)
        } catch (error) {
            this.HataMesajiPopupAcKapa(true, error.message)
        }
    }
    @action GorunecekDovizIsminiAyarla = async (tumParalarinObjeleri, index) => {
        return tumParalarinObjeleri[index].includes("EUR") ? "EUR" : tumParalarinObjeleri[index].includes("USD") ? "USD" : tumParalarinObjeleri[index]
    }
    @action Paralarin1TLKarsisindakiDegeriniBul = async (paralarListesi) => {
        const paralarListesiObjeleri = Object.keys(paralarListesi)

        let sonuc = {}
        for (let i = 0; i < paralarListesiObjeleri.length; i++) {
            sonuc = {
                ...sonuc,
                [paralarListesiObjeleri[i]]: SayiyiUstGostergesiOlmadanHesapla((1 / paralarListesi[paralarListesiObjeleri[i]]), 8)
            }
        }
        return sonuc
    }
    //#endregion

    //#region DovizHesapla
    @action DovizHesapla = async (degerGirilenTextBoxAdi: string, deger: any) => {
        const degerGirilenID = degerGirilenTextBoxAdi.substring(9, 10)

        this.dinamik.set(degerGirilenTextBoxAdi, deger.toString())
        this.dinamik.set("lblMiktar" + degerGirilenID, deger.toString())

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id !== Number(degerGirilenID)) {

                const ustGostergesizSonuc = SayiyiUstGostergesiOlmadanHesapla((this.data[i].value / this.data[Number(degerGirilenID) - 1].value) * Number(deger), 4)
                const ustGostergesizSonuc2 = ustGostergesizSonuc.replace(".", ",")

                this.dinamik.set("lblMiktar" + this.data[i].id, SayiyiBasamaklaraAyir(ustGostergesizSonuc2))
                this.dinamik.set("txtMiktar" + this.data[i].id, ustGostergesizSonuc)
            }
        }
    }
    //#endregion
}

export default new ListeCeviriciStore()