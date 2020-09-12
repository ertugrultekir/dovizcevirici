import React, { Component } from 'react'
import { Modal, ActivityIndicator, View, Text, StyleSheet } from 'react-native'


interface Props {
    acikMi: boolean
}
interface State {

}
export default class LoadingPopup extends Component<Props, State> {
    state = {}

    render() {
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.acikMi}
                    onRequestClose={() => { }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <View style={styles.modalBaslik}>
                                <Text style={styles.modalBaslikText}>Lüfen Bekleyiniz</Text>
                            </View>

                            <View style={styles.icerikAlani}>
                                <ActivityIndicator size="large" />
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
        width: 250,
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
        height: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    modalBaslik: {
        width: "100%",
        height: 40,
        backgroundColor: "#18d1ac",
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