import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ListeCeviriciStore from '../../../Stores/ListeCevirici/ListeCeviriciStore'
import TextInputBox, { KeyboardType } from '../../Araclar/TextInputBox'


interface Props {
    item: any
    index: number
}
interface State {

}
@observer
export default class ListeCeviriciFlatListRenderItem extends Component<Props, State> {
    state = {}

    render() {
        const { item }: Props = this.props
        return (
            <View style={style.mainView}>
                <View style={style.paraBirimiVeInputView}>
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    <View style={style.textInputBoxView}>
                        <TextInputBox
                            OnChangeText={ListeCeviriciStore.DinamikOnChange}
                            name={"txtMiktar" + item.id}
                            value={ListeCeviriciStore.dinamik.get("txtMiktar" + item.id)}
                            keyboardType={KeyboardType.numeric}
                        />
                    </View>
                </View>
                <Text style={{ textAlign: "center", marginTop: 8 }}>
                    <Text style={{ fontWeight: "bold" }}>{`${ListeCeviriciStore.dinamik.get("lblMiktar" + item.id)} `}</Text>
                    {item.name}
                </Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    mainView: {
        padding: 10,
        borderColor: "gray",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: "white",
    },
    paraBirimiVeInputView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    textInputBoxView: {
        width: "80%"
    }
})