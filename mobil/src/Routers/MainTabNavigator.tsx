import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import { RootStackParamList } from '../../App'
import ListeCevirici from '../Pages/ListeCevirici'
import TekliCevirici from '../Pages/TekliCevirici'


const MainTab = createBottomTabNavigator<RootStackParamList>()

interface Props {

}
interface State {

}
export default class MainTabNavigator extends Component<Props, State> {
    state = {}

    render() {
        return (
            <MainTab.Navigator tabBarOptions={{ keyboardHidesTabBar: true }}>
                <MainTab.Screen
                    name="TekliCevirici"
                    component={TekliCevirici}
                    options={{ title: "Çevirici" }}
                />
                <MainTab.Screen
                    name="ListeCevirici"
                    component={ListeCevirici}
                    options={{ title: "Liste Tipi Çevirici" }}
                />
            </MainTab.Navigator>
        )
    }
}
