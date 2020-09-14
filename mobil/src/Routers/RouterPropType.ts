import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';


//@ts-ignore
type ScreenRouteProp<T> = RouteProp<RootStackParamList, T>;
//@ts-ignore
type ScreenNavigationProp<T> = StackNavigationProp<RootStackParamList, T>;


export interface RouterPropType<T> {
    route: ScreenRouteProp<T>
    navigation: ScreenNavigationProp<T>
}