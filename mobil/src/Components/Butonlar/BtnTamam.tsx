import React, { Component } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'


interface Props {
    OnPress: Function
}
interface State {

}
export default class BtnTamam extends Component<Props, State> {
    state = {}
    style = StyleSheet.create({
        btnGirisYapMainIc: {
            // flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 15,
            marginLeft: 10,
            marginRight: 10
        },
        btnSifremiUnuttum: {
            width: "100%",
            backgroundColor: "#009999",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            padding: 10,
        },
    })

    OnPress = () => {
        this.props.OnPress()
    }

    render() {
        return (
            <TouchableOpacity onPress={this.OnPress} style={this.style.btnSifremiUnuttum}>
                <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Tamam</Text>
            </TouchableOpacity>
        )
    }
}
