import React, { Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import TekliCeviriciBtnYerDegistir from '../Components/Pages/TekliCevirici/TekliCeviriciBtnYerDegistir'
import DropdownList from '../Components/Araclar/DropdownList'
import TextInputBox, { KeyboardType } from '../Components/Araclar/TextInputBox'
import Layout from '../Components/Layout/Layout'
import { RouterPropType } from '../Routers/RouterPropType'
import { observer } from 'mobx-react'
import TekliCeviriciStore from '../Stores/TekliCevirici/TekliCeviriciStore'
import { toJS } from 'mobx'


interface Props extends RouterPropType<"TekliCevirici"> {

}
interface State {

}
@observer
export default class TekliCevirici extends Component<Props, State> {
    state = {}

    async componentDidMount() {
        await TekliCeviriciStore.DovizleriGetir()
        await TekliCeviriciStore.DovizHesapla()
        TekliCeviriciStore.LoadingPopupAcKapa(false)
    }

    render() {
        const seciliBirinciDovizinAdi = TekliCeviriciStore.tumParalarDiziyeDonusturulmusListe.length > 0 ? TekliCeviriciStore.tumParalarDiziyeDonusturulmusListe[TekliCeviriciStore.ddlBirinciDoviz - 1].name : ""

        const seciliIkinciDovizinAdi = TekliCeviriciStore.tumParalarDiziyeDonusturulmusListe.length > 0 ? TekliCeviriciStore.tumParalarDiziyeDonusturulmusListe[TekliCeviriciStore.ddlIkinciDoviz - 1].name : ""

        return (
            <Layout
                HataMesajiPopupOnClose={() => TekliCeviriciStore.HataMesajiPopupAcKapa(false)}
                hataMesajiPopupAcikMi={TekliCeviriciStore.hataMesajiPopupAcikMi}
                hataMesajiPopupMesaj={TekliCeviriciStore.hataMesajiPopupMesaj}
                loadingPopupAcikMi={TekliCeviriciStore.loadingPopupAcikMi}
            >
                <View style={style.mainView}>
                    <View style={style.baslikMainView}>
                        <Image
                            source={require("../Images/Icons/money2.png")}
                            style={{ width: 35, height: 35 }}
                            resizeMode={"stretch"}
                        />
                        <Text style={style.baslikText}>Döviz Çevirici</Text>
                    </View>

                    <View style={style.mainViewIciView}>
                        <View style={style.textboxMainViewIcindekiAraclarinAnaBoyuView}>
                            <TextInputBox
                                OnChangeText={TekliCeviriciStore.OnChangeText}
                                name="txtBirinciDoviz"
                                value={TekliCeviriciStore.txtBirinciDoviz}
                                keyboardType={KeyboardType.numeric}
                                OnKeyPress={TekliCeviriciStore.OnKeyPress}
                            />
                        </View>
                        <View style={[style.textboxMainViewIcindekiAraclarinAnaBoyuView, { marginVertical: 0 }]}>
                            <DropdownList
                                DdlOnChange={TekliCeviriciStore.DdlDovizOnChange}
                                name="ddlBirinciDoviz"
                                options={toJS(TekliCeviriciStore.ddlBirinciDovizOptions)}
                                value={TekliCeviriciStore.ddlBirinciDoviz}
                            />
                        </View>
                        <TekliCeviriciBtnYerDegistir
                            OnPress={TekliCeviriciStore.BtnDovizYerleriniDegistir}
                        />
                        <View style={[style.textboxMainViewIcindekiAraclarinAnaBoyuView, { marginVertical: 0 }]}>
                            <DropdownList
                                DdlOnChange={TekliCeviriciStore.DdlDovizOnChange}
                                name="ddlIkinciDoviz"
                                options={toJS(TekliCeviriciStore.ddlIkinciDovizOptions)}
                                value={TekliCeviriciStore.ddlIkinciDoviz}
                            />
                        </View>
                        <View style={style.sonucView}>
                            <Text style={style.sonucMainText}>
                                {`${TekliCeviriciStore.txtBirinciDoviz} ${seciliBirinciDovizinAdi} = `}
                                <Text style={style.donusumSonucuText}>{`${TekliCeviriciStore.txtSonuc} `}</Text>
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
    baslikMainView: {
        marginVertical: 10,
        flexDirection: "row"
    },
    baslikText: {
        fontSize: 26,
        fontWeight: "bold",
        fontStyle: "italic",
        marginLeft: 10
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
