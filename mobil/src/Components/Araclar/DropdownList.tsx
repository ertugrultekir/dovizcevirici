import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Picker } from '@react-native-community/picker'


/**
 * Bir DropdownList oluşturmak istediğimizde options özelliğine bu tipte üretilmiş bir array vermeliyiz(Array<IDdlOptions>). DropdownList içerisine yerleştirmek istediğimiz datamızı for döngüsünde dönerek bu interface üzerine atayarak, options için uygun dtayı oluşturmuş oluyoruz.
 */
export interface IDdlOptions {
    text: string
    value: any
}
interface Props {
    value: any
    /**
     * @param itemValue = yeni value'yi geriye döner.
     * @param name = araç adını geriye döner.
     */
    DdlOnChange: Function
    options: Array<IDdlOptions>
    name: string
}
interface State {

}
export default class DropdownList extends Component<Props, State> {
    state = {}
    //#region style
    style = StyleSheet.create({
        mainView: {
            backgroundColor: "white",
            width: "100%",
            borderRadius: 5,
            borderColor: "gray",
            borderStyle: "solid",
            borderWidth: 1,
            height: 40
        },
        pickerMain: {
            width: "100%",
            marginLeft: 5,
            height: 40
        },
        // dropdownList: {
        //     width: "100%",
        //     // height: 40,
        //     backgroundColor: "white",
        //     borderStyle: "solid",
        //     borderWidth: 1,
        //     borderColor: "gray",
        //     borderRadius: 5,
        // }
    })
    //#endregion

    OnValueChange = (itemValue) => {
        if (itemValue !== this.props.value) {
            this.props.DdlOnChange(itemValue, this.props.name)
        }
    }

    render() {
        return (
            <View style={this.style.mainView}>
                <Picker
                    mode="dialog"
                    style={this.style.pickerMain}
                    selectedValue={this.props.value}
                    onValueChange={this.OnValueChange}
                >
                    {
                        this.props.options.map((x, index) =>
                            <Picker.Item label={x.text} value={x.value} key={index} />
                        )
                    }
                </Picker>
            </View>
        )
    }
}