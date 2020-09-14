import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import Layout from '../Components/Layout/Layout'
import ListeCeviriciFlatListRenderItem from '../Components/Pages/ListeCevirici/ListeCeviriciFlatListRenderItem'
import { RouterPropType } from '../Routers/RouterPropType'
import ListeCeviriciStore from '../Stores/ListeCevirici/ListeCeviriciStore'


interface Props extends RouterPropType<"ListeCevirici"> {

}
interface State {

}
@observer
export default class ListeCevirici extends Component<Props, State> {
    state = {}

    async componentDidMount() {
        await ListeCeviriciStore.DovizIlkYuklemeleriniYap()
        ListeCeviriciStore.LoadingPopupAcKapa(false)
    }

    render() {
        return (
            <Layout
                HataMesajiPopupOnClose={() => ListeCeviriciStore.HataMesajiPopupAcKapa(false)}
                hataMesajiPopupAcikMi={ListeCeviriciStore.hataMesajiPopupAcikMi}
                hataMesajiPopupMesaj={ListeCeviriciStore.hataMesajiPopupMesaj}
                loadingPopupAcikMi={ListeCeviriciStore.loadingPopupAcikMi}
                scrollViewKapatilsinMi
            >
                <FlatList
                    data={ListeCeviriciStore.data}
                    ListHeaderComponent={
                        <View style={style.baslikMainView}>
                            <Text style={style.baslikText}>Liste Tipi Döviz Çevirici</Text>
                        </View>
                    }
                    renderItem={({ item, index }) => (
                        <ListeCeviriciFlatListRenderItem
                            item={item}
                            index={index}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </Layout>
        )
    }
}

const style = StyleSheet.create({
    baslikMainView: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 20
    },
    baslikText: {
        fontWeight: "bold",
        fontSize: 22
    }
})