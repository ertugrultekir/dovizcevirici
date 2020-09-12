import React, { Component } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import HataMesajiPopup from '../Popuplar/HataMesajiPopup'
import LoadingPopup from '../Popuplar/LoadingPopup'


interface Props {
    HataMesajiPopupOnClose(): void
    hataMesajiPopupAcikMi: boolean
    hataMesajiPopupMesaj: string
    loadingPopupAcikMi: boolean
    scrollViewKapatilsinMi?: boolean
}
interface State {

}
export default class Layout extends Component<Props, State> {
    state = {}

    render() {
        return (
            <SafeAreaView style={style.flex_1}>
                <KeyboardAvoidingView
                    style={style.flex_1}
                    behavior={(Platform.OS === 'ios') ? "padding" : undefined}
                >
                    {
                        this.props.scrollViewKapatilsinMi ?
                            <View style={{ flexGrow: 1 }}>
                                {this.props.children}
                            </View>
                            :
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                {this.props.children}
                            </ScrollView>
                    }

                    {
                        this.props.hataMesajiPopupAcikMi ?
                            <HataMesajiPopup
                                BackButtonOnClose={this.props.HataMesajiPopupOnClose}
                                BtnTamamOnOpress={this.props.HataMesajiPopupOnClose}
                                acikMi={this.props.hataMesajiPopupAcikMi}
                                baslik="Hata :("
                                hataMesaji={this.props.hataMesajiPopupMesaj}
                            />
                            :
                            null
                    }
                    {
                        this.props.loadingPopupAcikMi ?
                            <LoadingPopup
                                acikMi={this.props.loadingPopupAcikMi}
                            />
                            :
                            null
                    }
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}

const style = StyleSheet.create({
    flex_1: {
        flex: 1
    },
})