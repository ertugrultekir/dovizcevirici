import { SayiyiBasamaklaraAyir, SayiyiUstGostergesiOlmadanHesapla } from './../../Utilities/GenelFonksiyonlar';
import { action, configure, observable, runInAction, toJS } from "mobx"
import AppStore from '../AppStore';
import { IDdlOptions } from '../../Components/Araclar/DropdownList';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

configure({
    enforceActions: "observed"
})

class TekliCeviriciStore {
    //#region Stateler
    @observable hataMesajiPopupAcikMi = false
    @observable hataMesajiPopupMesaj = ""
    @observable loadingPopupAcikMi = true

    @observable txtBirinciDoviz = "1"
    @observable txtSonuc = ""
    @observable pressedKey = ""
    @observable ddlBirinciDoviz = 1
    @observable ddlIkinciDoviz = 2

    @observable ddlBirinciDovizOptions: Array<IDdlOptions> = []
    @observable ddlIkinciDovizOptions: Array<IDdlOptions> = []
    @observable tumParalarListesi = {}
    @observable tumParalarDiziyeDonusturulmusListe: Array<any> = []
    //#endregion
    //#region OnChangeText, OnKeyPress, DdlDovizOnChange
    @action OnChangeText = (e: string, name: string) => {
        // Kullanıcının klavyeden birden fazla kez virgül,nokta veya farklı karaterler koymasını engeller.

        const girilenDeger = e.substring(e.length - 1, e.length)
        const dahaOncekiDegerdeNoktaVarMi = this[name].indexOf(".")

        if (dahaOncekiDegerdeNoktaVarMi === - 1 || girilenDeger !== "." && girilenDeger !== "-" || this.pressedKey === "Backspace") {
            this[name] = e
            this.DovizHesapla()
        }
    }
    @action OnKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        // NOT: Eğer basılan tuş Backspace ise OnKeyPress eventi OnChangeText'den önce çalışıyor. Ancak diğer tüm press durumlarında önce OnChangeText sonra OnKeyPress çalışıyor. Bu sebeple üst kısımdaki kontroller bu mantık çerçevesinde yapıldı.
        // NOT 2: Bu fonksiyon android cihazlar'da yalnızca fiziksel(gerçek) cihazlarda çalışmaktadır. Emulatorler bu metodu görmez.

        this.pressedKey = e.nativeEvent.key
    }
    @action DdlDovizOnChange = async (e, name) => {
        this[name] = e
        await this.DdlDovizIcindekiEslesenVerileriKaldir()
        await this.DovizHesapla()
    }
    //#endregion

    //#region LoadingPopupAcKapa, HataMesajiPopupAcKapa
    @action LoadingPopupAcKapa = (acikMi: boolean) => {
        this.loadingPopupAcikMi = acikMi
    }
    @action HataMesajiPopupAcKapa = (acikMi: boolean, hataMesaji?: string) => {
        this.hataMesajiPopupMesaj = hataMesaji!
        this.hataMesajiPopupAcikMi = acikMi
    }
    //#endregion

    //#region DovizleriGetir, GorunecekDovizIsminiAyarla, Paralarin1TLKarsisindakiDegeriniBul
    @action DovizleriGetir = async () => {
        try {
            const dovizlerSonuc = AppStore.dovizlerListesi
            const kriptoParalarsonuc = AppStore.kriptoParalarListesi

            runInAction(() => {
                this.tumParalarListesi = dovizlerSonuc.items[0]
                delete this.tumParalarListesi["Tarih"]
                delete this.tumParalarListesi["UNIXTIME"]
            })

            const kriptoParaObjeleri = Object.keys(kriptoParalarsonuc)
            for (let i = 0; i < kriptoParaObjeleri.length; i++) {
                runInAction(() => {
                    this.tumParalarListesi = {
                        ...this.tumParalarListesi,
                        [kriptoParaObjeleri[i]]: kriptoParalarsonuc[kriptoParaObjeleri[i]].quote.TRY.price
                    }
                })
            }

            const paralarin1TLDonusumSonucu = await this.Paralarin1TLKarsisindakiDegeriniBul(this.tumParalarListesi)
            runInAction(() => {
                this.tumParalarListesi = paralarin1TLDonusumSonucu
            })

            await this.DdlDovizIcindekiEslesenVerileriKaldir()
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

    //#region DdlDovizIlkYuklemeleriniYap, DdlDovizIcindekiEslesenVerileriKaldir
    @action DdlDovizIlkYuklemeleriniYap = async () => {
        const tumParalarDiziyeDonusturulmusListe: Array<any> = []
        const ddlBirinciDovizOptions: Array<IDdlOptions> = []
        const ddlIkinciDovizOptions: Array<IDdlOptions> = []

        //#region Türk Lirası ApiCall içerisinden gelmediği için bu kısımda el ile ekliyoruz.
        tumParalarDiziyeDonusturulmusListe.push(
            {
                id: 1,
                value: 1,
                name: "TRY",
                varsayilanIsim: "TRY"
            }
        )
        ddlBirinciDovizOptions.push(
            { text: "TRY", value: 1 }
        )
        ddlIkinciDovizOptions.push(
            { text: "TRY", value: 1 }
        )
        //#endregion

        const tumParalarinObjeleri = Object.keys(this.tumParalarListesi)
        for (let i = 0; i < tumParalarinObjeleri.length; i++) {
            tumParalarDiziyeDonusturulmusListe.push(
                {
                    id: i + 2,
                    value: this.tumParalarListesi[tumParalarinObjeleri[i]],
                    name: await this.GorunecekDovizIsminiAyarla(tumParalarinObjeleri, i),
                    varsayilanIsim: tumParalarinObjeleri[i]
                }
            )
            ddlBirinciDovizOptions.push(
                { text: await this.GorunecekDovizIsminiAyarla(tumParalarinObjeleri, i), value: i + 2 }
            )
            ddlIkinciDovizOptions.push(
                { text: await this.GorunecekDovizIsminiAyarla(tumParalarinObjeleri, i), value: i + 2 }
            )
        }

        runInAction(() => {
            this.ddlBirinciDovizOptions = []
            this.ddlIkinciDovizOptions = []

            this.tumParalarDiziyeDonusturulmusListe = tumParalarDiziyeDonusturulmusListe
            this.ddlBirinciDovizOptions = ddlBirinciDovizOptions
            this.ddlIkinciDovizOptions = ddlIkinciDovizOptions
        })
    }
    @action DdlDovizIcindekiEslesenVerileriKaldir = async () => {
        await this.DdlDovizIlkYuklemeleriniYap()

        runInAction(() => {
            this.ddlBirinciDovizOptions.map((x, index) => x.value === this.ddlIkinciDoviz ? this.ddlBirinciDovizOptions.splice(index, 1) : null)
            this.ddlIkinciDovizOptions.map((x, index) => x.value === this.ddlBirinciDoviz ? this.ddlIkinciDovizOptions.splice(index, 1) : null)
        })
    }
    //#endregion

    //#region DovizHesapla
    @action DovizHesapla = async () => {
        let birinciDovizDegeri
        let ikinciDovizDegeri

        for (let i = 0; i < this.tumParalarDiziyeDonusturulmusListe.length; i++) {
            if (this.tumParalarDiziyeDonusturulmusListe[i].id === this.ddlBirinciDoviz) {
                birinciDovizDegeri = this.tumParalarDiziyeDonusturulmusListe[i].value
            }
            else if (this.tumParalarDiziyeDonusturulmusListe[i].id === this.ddlIkinciDoviz) {
                ikinciDovizDegeri = this.tumParalarDiziyeDonusturulmusListe[i].value
            }

            if (birinciDovizDegeri !== undefined && ikinciDovizDegeri !== undefined) {
                break
            }
        }

        let ustGostergesizSonuc = SayiyiUstGostergesiOlmadanHesapla((ikinciDovizDegeri / birinciDovizDegeri) * Number(this.txtBirinciDoviz), 4)
        ustGostergesizSonuc = ustGostergesizSonuc.replace(".", ",")

        runInAction(() => {
            this.txtSonuc = SayiyiBasamaklaraAyir(ustGostergesizSonuc)
        })
    }
    //#endregion

    //#region BtnDovizYerleriniDegistir
    @action BtnDovizYerleriniDegistir = () => {
        const oncekiIlkOptions = JSON.parse(JSON.stringify(this.ddlBirinciDovizOptions))
        const oncekiIkinciOptions = JSON.parse(JSON.stringify(this.ddlIkinciDovizOptions))
        const oncekiDdlBirinciDoviz = JSON.parse(JSON.stringify(this.ddlBirinciDoviz))
        const oncekiDdlIkinciDoviz = JSON.parse(JSON.stringify(this.ddlIkinciDoviz))

        runInAction(() => {
            this.ddlBirinciDovizOptions = oncekiIkinciOptions
            this.ddlIkinciDovizOptions = oncekiIlkOptions

            this.ddlBirinciDoviz = oncekiDdlIkinciDoviz
            this.ddlIkinciDoviz = oncekiDdlBirinciDoviz
        })

        this.DovizHesapla()
    }
    //#endregion
}

export default new TekliCeviriciStore()