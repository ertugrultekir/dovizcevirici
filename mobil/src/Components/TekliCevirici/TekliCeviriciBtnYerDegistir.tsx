import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'


interface Props {
    OnPress(): void
}
interface State {

}
export default class TekliCeviriciBtnYerDegistir extends Component<Props, State> {
    state = {}

    render() {
        return (
            <TouchableOpacity
                style={style.mainView}
                onPress={this.props.OnPress}
            >
                <Image
                    source={require("../../Images/Icons/takasOklari.png")}
                    style={{ width: 25, height: 25 }}
                />
            </TouchableOpacity>
        )
    }
}

const style = StyleSheet.create({
    mainView: {
        backgroundColor: "dodgerblue",
        height: 50,
        width: 65,
        marginVertical: 10,
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center"
    }
})