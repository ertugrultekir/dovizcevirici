import React, { Component } from 'react'
import { TextInput, StyleSheet, View, Text, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'


export enum KeyboardType {
    default = "default",
    decimalPad = "decimal-pad",
    numeric = "numeric",
    email = "email-address",
    phonePad = "phone-pad"
}
export enum AutoCapitalizeType {
    characters = "characters",
    words = "words",
    sentences = "sentences",
    none = "none"
}
interface Props {
    value: string
    name: string
    /**
     * @param e = yeni value'yi geriye döner.
     * @param name = araç adını geriye döner.
     */
    OnChangeText(e: string, name: string): void
    OnKeyPress?(e: NativeSyntheticEvent<TextInputKeyPressEventData>): void
    editable?: boolean
    keyboardType?: KeyboardType
    hataVarMi?: boolean
    hataMesaji?: string
    OnBlur?(name: string, value: any, BosMuKontroluYapilsinMi?: boolean, EmailKontroluYapilsinMi?: boolean, GecerliNumaraMiKontroluYapilsinMi?: boolean, MinLengthKontroluYapilsinMi?: boolean, MinLength?: number): Promise<void>
    OnFocus?: Function
    maxLength?: number
    placeholder?: string
    secureTextEntryAktifMi?: boolean
    autoCapitalize?: AutoCapitalizeType
}
interface State {

}
export default class TextInputBox extends Component<Props, State> {
    state = {

    }
    style = StyleSheet.create({
        textBox: {
            width: "100%",
            height: 40,
            borderColor: "gray",
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: "white",
            paddingLeft: 15,
            paddingRight: 15,
            // elevation: 5
        },
    })

    //#region UNSAFE_componentWillMount, UNSAFE_componentWillReceiveProps
    UNSAFE_componentWillMount() {
        this.style.textBox = {
            ...this.style.textBox,
            backgroundColor: this.props.editable === false ? "#a8a8a8" : "white"
        }
        this.forceUpdate()
    }
    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        this.style.textBox = {
            ...this.style.textBox,
            backgroundColor: nextProps.editable === false ? "#a8a8a8" : "white"
        }
        this.forceUpdate()
    }
    //#endregion

    //#region OnFocus, OnBlur
    OnFocus = async () => {
        this.style.textBox = { ...this.style.textBox, borderColor: "#87ceeb" }
        if (this.props.OnFocus !== undefined) {
            await this.props.OnFocus()
        }
        this.forceUpdate()
    }
    OnBlur = async () => {
        if (this.props.OnBlur !== undefined) {
            //@ts-ignore
            await this.props.OnBlur()

            if (this.props.hataVarMi) {
                this.style.textBox = { ...this.style.textBox, borderColor: "red" }
            }
            else {
                this.style.textBox = { ...this.style.textBox, borderColor: "gray" }
            }
        }
        else {
            this.style.textBox = { ...this.style.textBox, borderColor: "gray" }
        }
        this.forceUpdate()
    }
    //#endregion


    render() {
        return (
            <View style={{ width: "100%" }}>
                <TextInput
                    style={[this.style.textBox]}
                    value={this.props.value}
                    onChangeText={(e) => this.props.OnChangeText(e, this.props.name)}
                    onFocus={this.OnFocus}
                    /**
                     * Eğer bu araç için bir hata kontrolü yapılacaksa, hata kontrolü için ilgili sayfaya bu metod arrow function olarak verilmelidir. Verilen metod içerisinde async olan TxtOnBlurValidasyon metodu çağırılmalıdır.  
                     */
                    onBlur={this.OnBlur}
                    editable={this.props.editable}
                    keyboardType={this.props.keyboardType}
                    maxLength={this.props.maxLength}
                    placeholder={this.props.placeholder}
                    secureTextEntry={this.props.secureTextEntryAktifMi}
                    autoCapitalize={this.props.autoCapitalize}

                    onKeyPress={this.props.OnKeyPress}
                />
                {
                    this.props.hataVarMi ?
                        <Text style={{ color: "red", marginLeft: 18 }}>{this.props.hataMesaji}</Text>
                        :
                        null
                }
                {/* <Text style={{ color: "red", marginLeft: 18 }}>{this.props.HataVarMi ? this.props.HataMesaji : ""}</Text> */}
            </View>
        )
    }
}