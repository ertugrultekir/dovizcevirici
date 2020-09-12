import React, { Component } from 'react'
import { StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData, Text, View } from 'react-native'
import TekliCeviriciBtnYerDegistir from '../Components/TekliCevirici/TekliCeviriciBtnYerDegistir'
import DropdownList, { IDdlOptions } from '../Components/Araclar/DropdownList'
import axios from "axios"
import { SayiyiBasamaklaraAyir, SayiyiUstGostergesiOlmadanHesapla, TarihiStringeCevir } from '../Utilities/GenelFonksiyonlar'
import TextInputBox, { KeyboardType } from '../Components/Araclar/TextInputBox'
import Holidays from "date-holidays"
import Layout from '../Components/Layout/Layout'


interface Props {

}
interface State {
    hataMesajiPopupAcikMi?: boolean
    hataMesajiPopupMesaj?: string
    loadingPopupAcikMi?: boolean

    txtBirinciDoviz?: string
    txtSonuc?: string
    pressedKey?: string
    ddlBirinciDoviz?: any
    ddlIkinciDoviz?: any
}
export default class TekliCevirici extends Component<Props, State> {
    state = {
        hataMesajiPopupAcikMi: false,
        hataMesajiPopupMesaj: "",
        loadingPopupAcikMi: true,

        txtBirinciDoviz: "1",
        txtSonuc: "",
        pressedKey: "",
        ddlBirinciDoviz: 1,
        ddlIkinciDoviz: 2,
    }
    //#region Değişkenler
    ddlBirinciDovizOptions: Array<IDdlOptions> = []
    ddlIkinciDovizOptions: Array<IDdlOptions> = []
    tumParalarListesi = {}
    tumParalarDiziyeDonusturulmusListe: Array<any> = []
    //#endregion
    //#region OnChangeText, OnKeyPress, DdlDovizOnChange
    OnChangeText = (e: string, name: string) => {
        const girilenDeger = e.substring(e.length - 1, e.length)
        const dahaOncekiDegerdeNoktaVarMi = this.state[name].indexOf(".")

        if (dahaOncekiDegerdeNoktaVarMi === - 1) {
            this.setState({ [name]: e }, () => {
                this.DovizHesapla()
            })
        }
        else if (girilenDeger !== "." && girilenDeger !== "-" || this.state.pressedKey === "Backspace") {
            this.setState({ [name]: e }, () => {
                this.DovizHesapla()
            })
        }
    }
    OnKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        // NOT: Eğer basılan tuş Backspace ise OnKeyPress eventi OnChangeText'den önce çalışıyor. Ancak diğer tüm press durumlarında önce OnChangeText sonra OnKeyPress çalışıyor. Bu sebeple üst kısımdaki kontroller bu mantık çerçevesinde yapıldı.
        // NOT 2: Bu fonksiyon android cihazlar'da yalnızca fiziksel(gerçek) cihazlarda çalışmaktadır. Emulatorler bu metodu görmez.
        this.setState({ pressedKey: e.nativeEvent.key })
    }
    DdlDovizOnChange = (e, name) => {
        this.setState({ [name]: e }, async () => {
            await this.DdlDovizIcindekiEslesenVerileriKaldir()
            await this.DovizHesapla()
        })
    }
    //#endregion

    async componentDidMount() {
        await this.DovizleriGetir()
        await this.DovizHesapla()
        this.setState({ loadingPopupAcikMi: false })
    }

    //#region DovizleriGetir, DovizGetirmeIslemiIcinTarihBul, GorunecekDovizIsminiAyarla, Paralarin1TLKarsisindakiDegeriniBul
    DovizleriGetir = async () => {
        try {
            const gununTarihi = await this.DovizGetirmeIslemiIcinTarihBul()

            const dovizlerSonuc = await axios.get(`https://evds2.tcmb.gov.tr/service/evds/series=TP.DK.USD.S-TP.DK.EUR.S&startDate=${gununTarihi}&endDate=${gununTarihi}&type=json&key=OUOWPKExMb`)
            const kriptoParalarSonuc = await axios.get("http://api.coinlayer.com/live?access_key=b8ff96db3ba403a1a49584d1d345d4df&target=TRY&symbols=BTC,ETH,DOGE")

            if (dovizlerSonuc.status === 200 && kriptoParalarSonuc.status === 200) {
                this.tumParalarListesi = dovizlerSonuc.data.items[0]
                this.tumParalarListesi = { ...this.tumParalarListesi, ...kriptoParalarSonuc.data.rates }

                delete this.tumParalarListesi["Tarih"]
                delete this.tumParalarListesi["UNIXTIME"]

                const paralarin1TLDonusumSonucu = await this.Paralarin1TLKarsisindakiDegeriniBul(this.tumParalarListesi)
                this.tumParalarListesi = paralarin1TLDonusumSonucu

                await this.DdlDovizIcindekiEslesenVerileriKaldir()
                this.forceUpdate()
            }
            else {
                this.setState({
                    hataMesajiPopupAcikMi: true,
                    hataMesajiPopupMesaj: "Döviz bilgilerini getirirken bir hata oluştu."
                })
            }
        } catch (error) {
            this.setState({
                hataMesajiPopupAcikMi: true,
                hataMesajiPopupMesaj: error.message
            })
        }
    }
    DovizGetirmeIslemiIcinTarihBul = async () => {
        // Tatil günlerinde merkez bankası veri göndermediği için bu metod ile tatilden bir önceki günü buluyoruz.
        let gununTarihi = await TarihiStringeCevir(new Date())
        let yilOncelikliGununTarihi = await TarihiStringeCevir(new Date(), true)

        let tarih = new Date(`${yilOncelikliGununTarihi} 00:00:00 GMT+0000`)
        let gunHaftaninKacinciGunu = tarih.getDay()
        const hd = new Holidays("TR")
        let resmiTatilMi = hd.isHoliday(new Date(`${yilOncelikliGununTarihi} 00:00:00 GMT+0000`))

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
    GorunecekDovizIsminiAyarla = async (tumParalarinObjeleri, index) => {
        return tumParalarinObjeleri[index].includes("EUR") ? "EUR" : tumParalarinObjeleri[index].includes("USD") ? "USD" : tumParalarinObjeleri[index]
    }
    Paralarin1TLKarsisindakiDegeriniBul = async (paralarListesi) => {
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
    DdlDovizIlkYuklemeleriniYap = async () => {
        this.ddlBirinciDovizOptions = []
        this.ddlIkinciDovizOptions = []

        //#region Türk Lirası ApiCall içerisinden gelmediği için bu kısımda el ile ekliyoruz.
        this.tumParalarDiziyeDonusturulmusListe.push(
            {
                id: 1,
                value: 1,
                name: "TRY",
                varsayilanIsim: "TRY"
            }
        )
        this.ddlBirinciDovizOptions.push(
            { text: "TRY", value: 1 }
        )
        this.ddlIkinciDovizOptions.push(
            { text: "TRY", value: 1 }
        )
        //#endregion

        const tumParalarinObjeleri = Object.keys(this.tumParalarListesi)
        for (let i = 0; i < tumParalarinObjeleri.length; i++) {
            this.tumParalarDiziyeDonusturulmusListe.push(
                {
                    id: i + 2,
                    value: this.tumParalarListesi[tumParalarinObjeleri[i]],
                    name: await this.GorunecekDovizIsminiAyarla(tumParalarinObjeleri, i),
                    varsayilanIsim: tumParalarinObjeleri[i]
                }
            )
            this.ddlBirinciDovizOptions.push(
                { text: await this.GorunecekDovizIsminiAyarla(tumParalarinObjeleri, i), value: i + 2 }
            )
            this.ddlIkinciDovizOptions.push(
                { text: await this.GorunecekDovizIsminiAyarla(tumParalarinObjeleri, i), value: i + 2 }
            )
        }
    }
    DdlDovizIcindekiEslesenVerileriKaldir = async () => {
        await this.DdlDovizIlkYuklemeleriniYap()
        this.ddlBirinciDovizOptions.map((x, index) => x.value === this.state.ddlIkinciDoviz ? this.ddlBirinciDovizOptions.splice(index, 1) : null)
        this.ddlIkinciDovizOptions.map((x, index) => x.value === this.state.ddlBirinciDoviz ? this.ddlIkinciDovizOptions.splice(index, 1) : null)
        this.forceUpdate()
    }
    //#endregion

    //#region DovizHesapla
    DovizHesapla = async () => {
        let birinciDovizDegeri
        let ikinciDovizDegeri
        for (let i = 0; i < this.tumParalarDiziyeDonusturulmusListe.length; i++) {
            if (this.tumParalarDiziyeDonusturulmusListe[i].id === this.state.ddlBirinciDoviz) {
                birinciDovizDegeri = this.tumParalarDiziyeDonusturulmusListe[i].value
            }
            else if (this.tumParalarDiziyeDonusturulmusListe[i].id === this.state.ddlIkinciDoviz) {
                ikinciDovizDegeri = this.tumParalarDiziyeDonusturulmusListe[i].value
            }

            if (birinciDovizDegeri !== undefined && ikinciDovizDegeri !== undefined) {
                break
            }
        }

        let ustGostergesizSonuc = SayiyiUstGostergesiOlmadanHesapla((ikinciDovizDegeri / birinciDovizDegeri) * Number(this.state.txtBirinciDoviz), 4)
        ustGostergesizSonuc = ustGostergesizSonuc.replace(".", ",")

        this.setState({
            txtSonuc: SayiyiBasamaklaraAyir(ustGostergesizSonuc)
        })
    }
    //#endregion

    //#region BtnDovizYerleriniDegistir
    BtnDovizYerleriniDegistir = () => {
        const oncekiIlkOptions = JSON.parse(JSON.stringify(this.ddlBirinciDovizOptions))
        const oncekiIkinciOptions = JSON.parse(JSON.stringify(this.ddlIkinciDovizOptions))
        const oncekiDdlBirinciDoviz = JSON.parse(JSON.stringify(this.state.ddlBirinciDoviz))
        const oncekiDdlIkinciDoviz = JSON.parse(JSON.stringify(this.state.ddlIkinciDoviz))

        this.ddlBirinciDovizOptions = oncekiIkinciOptions
        this.ddlIkinciDovizOptions = oncekiIlkOptions
        this.setState({
            ddlBirinciDoviz: oncekiDdlIkinciDoviz,
            ddlIkinciDoviz: oncekiDdlBirinciDoviz
        }, () => {
            this.DovizHesapla()
        })
    }
    //#endregion

    render() {
        const { ddlBirinciDoviz, ddlIkinciDoviz, hataMesajiPopupMesaj, hataMesajiPopupAcikMi, loadingPopupAcikMi, txtBirinciDoviz, txtSonuc }: State = this.state

        const seciliBirinciDovizinAdi = this.tumParalarDiziyeDonusturulmusListe[ddlBirinciDoviz - 1] !== undefined ? this.tumParalarDiziyeDonusturulmusListe[ddlBirinciDoviz - 1].name : ""
        const seciliIkinciDovizinAdi = this.tumParalarDiziyeDonusturulmusListe[ddlIkinciDoviz - 1] !== undefined ? this.tumParalarDiziyeDonusturulmusListe[ddlIkinciDoviz - 1].name : ""

        return (
            <Layout
                HataMesajiPopupOnClose={() => this.setState({ hataMesajiPopupAcikMi: false })}
                hataMesajiPopupAcikMi={hataMesajiPopupAcikMi}
                hataMesajiPopupMesaj={hataMesajiPopupMesaj}
                loadingPopupAcikMi={loadingPopupAcikMi}
            >
                <View style={style.mainView}>
                    <View style={style.mainViewIciView}>
                        <View style={style.textboxMainViewIcindekiAraclarinAnaBoyuView}>
                            <TextInputBox
                                OnChangeText={this.OnChangeText}
                                name="txtBirinciDoviz"
                                value={txtBirinciDoviz}
                                keyboardType={KeyboardType.numeric}
                                OnKeyPress={this.OnKeyPress}
                            />
                        </View>
                        <View style={[style.textboxMainViewIcindekiAraclarinAnaBoyuView, { marginVertical: 0 }]}>
                            <DropdownList
                                DdlOnChange={this.DdlDovizOnChange}
                                name="ddlBirinciDoviz"
                                options={this.ddlBirinciDovizOptions}
                                value={ddlBirinciDoviz}
                            />
                        </View>
                        <TekliCeviriciBtnYerDegistir
                            OnPress={this.BtnDovizYerleriniDegistir}
                        />
                        <View style={[style.textboxMainViewIcindekiAraclarinAnaBoyuView, { marginVertical: 0 }]}>
                            <DropdownList
                                DdlOnChange={this.DdlDovizOnChange}
                                name="ddlIkinciDoviz"
                                options={this.ddlIkinciDovizOptions}
                                value={ddlIkinciDoviz}
                            />
                        </View>
                        <View style={style.sonucView}>
                            <Text style={style.sonucMainText}>
                                {`${txtBirinciDoviz} ${seciliBirinciDovizinAdi} = `}
                                <Text style={style.donusumSonucuText}>{`${txtSonuc} `}</Text>
                                {seciliIkinciDovizinAdi}
                            </Text>
                        </View>
                    </View>
                </View>
            </Layout>
        )
    }
}

const style = StyleSheet.create({
    mainView: {
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1
    },
    mainViewIciView: {
        backgroundColor: "gainsboro",
        width: "90%",
        borderRadius: 5,
        elevation: 3,
        shadowColor: "gray",
        shadowOffset: {
            height: 0,
            width: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10
    },
    textboxMainViewIcindekiAraclarinAnaBoyuView: {
        width: "95%",
        marginVertical: 10
    },
    sonucView: {
        backgroundColor: "white",
        marginVertical: 10,
        borderRadius: 5,
        width: "95%"
    },
    sonucMainText: {
        marginVertical: 10,
        marginHorizontal: 10,
        fontSize: 14
    },
    donusumSonucuText: {
        fontWeight: "bold",
        fontSize: 17
    }
})
