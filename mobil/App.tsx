import { NavigationContainer } from '@react-navigation/native'
import Holidays from 'date-holidays'
import React, { Component } from 'react'
import MainTabNavigator from './src/Routers/MainTabNavigator'
import { TarihiStringeCevir } from './src/Utilities/GenelFonksiyonlar'
import axios from "axios"
import { observer } from 'mobx-react'
import ListeCeviriciStore from './src/Stores/ListeCevirici/ListeCeviriciStore'
import Layout from './src/Components/Layout/Layout'


export type RootStackParamList = {
  TekliCevirici: { dovizlerApicallSonuc: any, kriptoParalarApicallSonuc: any, test: any }
  ListeCevirici: undefined
};

interface Props {

}
interface State {
  loadingPopupAcikMi?: boolean
  hataMesajiPopupMesaj?: string
  hataMesajiPopupAcikMi?: boolean

  dovizlerListesi?: any
  kriptoParalarListesi?: any
}
@observer
export default class App extends Component<Props, State> {
  state = {
    loadingPopupAcikMi: true,
    hataMesajiPopupMesaj: "",
    hataMesajiPopupAcikMi: false,

    dovizlerListesi: {},
    kriptoParalarListesi: {},
  }

  async componentDidMount() {
    await this.DovizleriGetir()
    await this.KriptoParalariGetir()
    this.setState({ loadingPopupAcikMi: false })
  }

  //#region ParalariGetir, KriptoParalariGetir, DovizGetirmeIslemiIcinTarihBul
  DovizleriGetir = async () => {
    try {
      const gununTarihi = await this.DovizGetirmeIslemiIcinTarihBul()

      const dovizlerSonuc = await axios.get(`https://evds2.tcmb.gov.tr/service/evds/series=TP.DK.USD.S-TP.DK.EUR.S&startDate=${gununTarihi}&endDate=${gununTarihi}&type=json&key=OUOWPKExMb`)

      if (dovizlerSonuc.status === 200) {
        this.setState({
          dovizlerListesi: dovizlerSonuc.data,
        })
      }
      else {
        this.setState({
          hataMesajiPopupAcikMi: true,
          hataMesajiPopupMesaj: "Döviz bilgilerini getirirken bir hata oluştu."
        })
      }

      ListeCeviriciStore.DovizleriAl(dovizlerSonuc.data)
    } catch (error) {
      this.setState({
        hataMesajiPopupAcikMi: true,
        hataMesajiPopupMesaj: error.message
      })
    }
  }
  KriptoParalariGetir = async () => {
    try {
      const kriptoParalarSonuc = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,DOGE&convert=TRY", { headers: { "X-CMC_PRO_API_KEY": "23e0d3d1-41ae-43a0-87e3-57b4d2764bc6" } })

      if (kriptoParalarSonuc.status === 200) {
        this.setState({
          kriptoParalarListesi: kriptoParalarSonuc.data.data,
        })

        ListeCeviriciStore.KriptoParalariAl(kriptoParalarSonuc.data.data)
      }
      else {
        this.setState({
          hataMesajiPopupAcikMi: true,
          hataMesajiPopupMesaj: "Kripto paraları getirirken hata oluştu.",
        })
      }
    } catch (error) {
      this.setState({
        hataMesajiPopupAcikMi: true,
        hataMesajiPopupMesaj: error.message,
      })
    }
  }
  DovizGetirmeIslemiIcinTarihBul = async () => {
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

  render() {
    return (
      this.state.loadingPopupAcikMi || this.state.hataMesajiPopupAcikMi ?
        <Layout
          HataMesajiPopupOnClose={() => this.setState({ hataMesajiPopupAcikMi: false })}
          hataMesajiPopupAcikMi={this.state.hataMesajiPopupAcikMi}
          hataMesajiPopupMesaj={this.state.hataMesajiPopupMesaj}
          loadingPopupAcikMi={this.state.loadingPopupAcikMi}
        />
        :
        <NavigationContainer>
          <MainTabNavigator
            dovizlerApicallSonuc={this.state.dovizlerListesi}
            kriptoParalarApicallSonuc={this.state.kriptoParalarListesi}
          />
        </NavigationContainer>
    )
  }
}
