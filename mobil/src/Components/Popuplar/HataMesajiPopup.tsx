import React, { Component } from 'react'
import { View, Modal, Text, StyleSheet } from 'react-native'
import BtnTamam from '../Butonlar/BtnTamam'


interface Props {
    acikMi: boolean
    BtnTamamOnOpress: Function
    BackButtonOnClose: Function
    baslik: string
    hataMesaji: string
}
interface State {

}
export default class HataMesajiPopup extends Component<Props, State> {
    state = {}

    render() {
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.acikMi}
                    onRequestClose={() => { this.props.BackButtonOnClose() }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <View style={styles.modalBaslikMain}>
                                <Text style={styles.modalBaslikText}>{this.props.baslik}</Text>
                            </View>

                            <View style={styles.icerikAlani}>
                                <View>
                                    <Text>{this.props.hataMesaji}</Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <BtnTamam OnPress={this.props.BtnTamamOnOpress} />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        width: "85%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    icerikAlani: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        paddingBottom: 20,
    },
    modalBaslikMain: {
        width: "100%",
        height: 40,
        backgroundColor: "red",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalBaslikText: {
        fontWeight: "bold",
        color: "white",
        fontSize: 18
    }
});