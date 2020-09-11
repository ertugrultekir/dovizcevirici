import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'


interface Props {

}
interface State {

}
export default class TekliCeviriciBtnYerDegistir extends Component<Props, State> {
    state = {}

    OnPress = () => {

    }

    render() {
        return (
            <TouchableOpacity
                style={style.mainView}
                onPress={this.OnPress}
            >
                <Image
                    source={require("../../Images/Icons/takasOklari.png")}
                    style={{ width: 40, height: 40 }}
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