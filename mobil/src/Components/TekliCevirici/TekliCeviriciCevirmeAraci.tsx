import React, { Component } from 'react'
import { View, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData, Text } from 'react-native'
import TextInputBox, { KeyboardType } from '../Araclar/TextInputBox'
import DropdownList, { IDdlOptions } from '../Araclar/DropdownList'


interface Props {
    txtSayiName: string
    txtSayiValue: any
    /**
     * @param e = yeni value'yi geriye döner.
     * @param name = araç adını geriye döner.
     */
    OnChangeText(e: string, name: string): void
    OnKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>): void
    DdlOnChange(itemValue: any, name: string): void
    ddlDovizName: string
    ddlDovizOptions: Array<IDdlOptions>
    ddlDovizValue: any
}
interface State {

}
export default class TekliCeviriciCevirmeAraci extends Component<Props, State> {
    state = {}

    render() {
        return (
            <View style={style.mainView}>
                <DropdownList
                    DdlOnChange={this.props.DdlOnChange}
                    name={this.props.ddlDovizName}
                    options={this.props.ddlDovizOptions}
                    value={this.props.ddlDovizValue}
                />
                <View style={style.textboxMainView}>
                    <View style={{ width: "95%" }}>
                        <TextInputBox
                            OnChangeText={this.props.OnChangeText}
                            name={this.props.txtSayiName}
                            value={this.props.txtSayiValue}
                            keyboardType={KeyboardType.numeric}
                            OnKeyPress={this.props.OnKeyPress}
                        />
                    </View>
                </View>
                <Text style={style.birDovizEsittirText}>1 USD = 7.495 TRY</Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    mainView: {
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
        shadowOpacity: 0.5
    },
    textboxMainView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    birDovizEsittirText: {
        marginVertical: 10,
        marginHorizontal: 10,
        color: "dimgray"
    }
})