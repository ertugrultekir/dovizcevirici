import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Picker } from '@react-native-community/picker'
// import { Item, Picker } from "native-base";


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
    // placeholder?: string
}
interface State {

}
export default class DropdownList extends Component<Props, State> {
    state = {}
    style = StyleSheet.create({
        dropdownList: {
            width: "100%",
            // height: 40,
            backgroundColor: "white",
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 5,
        }
    })

    render() {
        return (
            <View style={{ backgroundColor: "white", width: "100%", borderRadius: 5, borderColor: "gray", borderStyle: "solid", borderWidth: 1, height: 40 }}>
                <Picker
                    mode="dialog"
                    style={{ width: "100%", marginLeft: 5, height: 40 }}
                    selectedValue={this.props.value}
                    onValueChange={(itemValue) => this.props.DdlOnChange(itemValue, this.props.name)}
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