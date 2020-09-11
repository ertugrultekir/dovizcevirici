import React, { Component } from 'react'
import { StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData, ScrollView, Button } from 'react-native'
import TekliCeviriciCevirmeAraci from '../Components/TekliCevirici/TekliCeviriciCevirmeAraci'
import TekliCeviriciBtnYerDegistir from '../Components/TekliCevirici/TekliCeviriciBtnYerDegistir'
import { IDdlOptions } from '../Components/Araclar/DropdownList'
import axios from "axios"
import { SayiyiUstGostergesiOlmadanHesapla, TarihiStringeCevir } from '../Utilities/GenelFonksiyonlar'


interface Props {

}
interface State {
    txtIlkDoviz?: string
    txtIkinciDoviz?: string
    pressedKey?: string
    ddlBirinciDoviz?: any
    ddlIkinciDoviz?: any
}
export default class TekliCevirici extends Component<Props, State> {
    state = {
        txtIlkDoviz: "1",
        txtIkinciDoviz: "",
        pressedKey: "",
        ddlBirinciDoviz: 1,
        ddlIkinciDoviz: 2,
    }
    //#region Değişkenler
    ddlBirinciDoviz: Array<IDdlOptions> = []
    ddlIkinciDoviz: Array<IDdlOptions> = []
    tumParalarListesi = {}
    tumParalarDiziyeDonusturulmusListe: Array<any> = []
    //#endregion
    //#region OnChangeText, OnKeyPress
    OnChangeText = (e: string, name: string) => {
        const girilenDeger = e.substring(e.length - 1, e.length)
        const dahaOncekiDegerdeNoktaVarMi = this.state[name].indexOf(".")

        if (dahaOncekiDegerdeNoktaVarMi === - 1) {
            this.setState({ [name]: e })
        }
        else if (girilenDeger !== "." && girilenDeger !== "-" || this.state.pressedKey === "Backspace") {
            this.setState({ [name]: e })
        }
    }
    OnKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        // NOT: Eğer basılan tuş Backspace ise OnKeyPress eventi OnChangeText'den önce çalışıyor. Ancak diğer tüm press durumlarında önce OnChangeText sonra OnKeyPress çalışıyor. Bu sebeple üst kısımdaki kontroller bu mantık çerçevesinde yapıldı.
        this.setState({ pressedKey: e.nativeEvent.key })
    }
    //#endregion
    //#region DdlDovizOnChange
    DdlDovizOnChange = (e, name) => {
        this.setState({ [name]: e }, async () => {
            await this.DdlDovizIcindekiEslesenVerileriKaldir()
        })
    }
    //#endregion

    //#region DovizleriGetir, GorunecekDovizIsminiAyarla
    DovizleriGetir = async () => {
        try {
            const gununTarihi = await TarihiStringeCevir(new Date())

            const dovizlerSonuc = await axios.get(`https://evds2.tcmb.gov.tr/service/evds/series=TP.DK.USD.S-TP.DK.EUR.S&startDate=${gununTarihi}&endDate=${gununTarihi}&type=json&key=OUOWPKExMb`)
            const kriptoParalarSonuc = await axios.get("http://api.coinlayer.com/live?access_key=b8ff96db3ba403a1a49584d1d345d4df&target=TRY&symbols=BTC,ETH,DOGE")

            if (dovizlerSonuc.status === 200 && kriptoParalarSonuc.status === 200) {
                this.tumParalarListesi = dovizlerSonuc.data.items[0]
                this.tumParalarListesi = { ...this.tumParalarListesi, ...kriptoParalarSonuc.data.rates }
                delete this.tumParalarListesi["Tarih"]
                delete this.tumParalarListesi["UNIXTIME"]

                // console.log(SayiyiUstGostergesiOlmadanHesapla(0.0000972 / 356.70, 8))

                // await this.DdlDovizIlkYuklemeleriniYap()
                await this.DdlDovizIcindekiEslesenVerileriKaldir()

                this.forceUpdate()
            }
        } catch (error) {
            console.log(error)
        }
    }
    GorunecekDovizIsminiAyarla = async (tumParalarinObjeleri, index) => {
        return tumParalarinObjeleri[index].includes("EUR") ? "EUR" : tumParalarinObjeleri[index].includes("USD") ? "USD" : tumParalarinObjeleri[index]
    }
    //#endregion

    //#region DdlDovizIlkYuklemeleriniYap, DdlDovizIcindekiEslesenVerileriKaldir
    DdlDovizIlkYuklemeleriniYap = async () => {
        this.ddlBirinciDoviz = []
        this.ddlIkinciDoviz = []

        //#region Türk Lirası ApiCall içerisinden gelmediği için bu kısımda el ile ekliyoruz.
        this.tumParalarDiziyeDonusturulmusListe.push(
            {
                id: 1,
                value: 1,
                name: "TRY",
                varsayilanIsim: "TRY"
            }
        )
        this.ddlBirinciDoviz.push(
            { text: "TRY", value: 1 }
        )
        this.ddlIkinciDoviz.push(
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
            this.ddlBirinciDoviz.push(
                { text: await this.GorunecekDovizIsminiAyarla(tumParalarinObjeleri, i), value: i + 2 }
            )
            this.ddlIkinciDoviz.push(
                { text: await this.GorunecekDovizIsminiAyarla(tumParalarinObjeleri, i), value: i + 2 }
            )
        }
    }
    DdlDovizIcindekiEslesenVerileriKaldir = async () => {
        await this.DdlDovizIlkYuklemeleriniYap()
        this.ddlBirinciDoviz.map((x, index) => x.value === this.state.ddlIkinciDoviz ? this.ddlBirinciDoviz.splice(index, 1) : null)
        this.ddlIkinciDoviz.map((x, index) => x.value === this.state.ddlBirinciDoviz ? this.ddlIkinciDoviz.splice(index, 1) : null)
        this.forceUpdate()
    }
    //#endregion

    render() {
        return (
            <ScrollView contentContainerStyle={style.mainView}>
                <TekliCeviriciCevirmeAraci
                    txtSayiName="txtIlkDoviz"
                    txtSayiValue={this.state.txtIlkDoviz}
                    OnChangeText={this.OnChangeText}
                    OnKeyPress={this.OnKeyPress}
                    DdlOnChange={this.DdlDovizOnChange}
                    ddlDovizName="ddlBirinciDoviz"
                    ddlDovizOptions={this.ddlBirinciDoviz}
                    ddlDovizValue={this.state.ddlBirinciDoviz}
                />
                <TekliCeviriciBtnYerDegistir />
                <TekliCeviriciCevirmeAraci
                    txtSayiName="txtIkinciDoviz"
                    txtSayiValue={this.state.txtIkinciDoviz}
                    OnChangeText={this.OnChangeText}
                    OnKeyPress={this.OnKeyPress}
                    DdlOnChange={this.DdlDovizOnChange}
                    ddlDovizName="ddlIkinciDoviz"
                    ddlDovizOptions={this.ddlIkinciDoviz}
                    ddlDovizValue={this.state.ddlIkinciDoviz}
                />
                <Button
                    onPress={this.DovizleriGetir}
                    title="Döviz Getir"
                />
            </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    mainView: {
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1
    }
})
