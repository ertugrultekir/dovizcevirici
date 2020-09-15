import { NavigationContainer } from '@react-navigation/native'
import React, { Component } from 'react'
import MainTabNavigator from './src/Routers/MainTabNavigator'
import { observer } from 'mobx-react'
import Layout from './src/Components/Layout/Layout'
import AppStore from './src/Stores/AppStore'


export type RootStackParamList = {
  TekliCevirici: { dovizlerApicallSonuc: any, kriptoParalarApicallSonuc: any, test: any }
  ListeCevirici: undefined
};

interface Props {

}
interface State {

}
@observer
export default class App extends Component<Props, State> {
  state = {}

  async componentDidMount() {
    await AppStore.DovizleriGetir()
    await AppStore.KriptoParalariGetir()
    AppStore.LoadingPopupAcKapa(false)
  }
  render() {
    return (
      AppStore.loadingPopupAcikMi || AppStore.hataMesajiPopupAcikMi ?
        <Layout
          HataMesajiPopupOnClose={() => AppStore.HataMesajiPopupAcKapa(false)}
          hataMesajiPopupAcikMi={AppStore.hataMesajiPopupAcikMi}
          hataMesajiPopupMesaj={AppStore.hataMesajiPopupMesaj}
          loadingPopupAcikMi={AppStore.loadingPopupAcikMi}
        />
        :
        <NavigationContainer>
          <MainTabNavigator />
        </NavigationContainer>
    )
  }
}
