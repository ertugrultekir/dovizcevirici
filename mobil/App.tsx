import React, { Component } from 'react'
import { View, SafeAreaView } from 'react-native'
import TekliCevirici from './src/Pages/TekliCevirici'


interface Props {

}
interface State {

}
export default class App extends Component<Props, State> {
  state = {}

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TekliCevirici />
      </SafeAreaView>
    )
  }
}
