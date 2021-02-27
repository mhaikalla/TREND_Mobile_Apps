/**
 * @Author: adhinugraha
 * @Last modified by:   adhinugraha
 * @Last modified time: 2019-03-12T15:33:41+07:00
 */

 import { createAppContainer } from 'react-navigation';
 import { createStackNavigator } from 'react-navigation-stack';

 import MyTechnicalScreen from '@screens/MyTechnicalScreen';
 import AllTechnicalScreen from '@screens/AllTechnicalRequestScreen';
 import ProductScreen from '@screens/ProductScreen';
 import DimensionScreen from '@screens/DimensionScreen';
 import ReferencesScreen from '@screens/ReferencesScreen';
 import WarrantyScreen from '@screens/WarrantyScreen';
 import GoodwillScreen from '@screens/GoodwillScreen';
 import PasswordScreen from '@screens/PasswordScreen';
 import TelematicsScreen from '@screens/TelematicsScreen';
 import ViewScreen from '@screens/ViewScreen';
 import LoginScreen from '@screens/LoginScreen';
 import DppmScreen from '@screens/DppmScreen';
 import ReopenScreen from '@screens/ReopenScreen';
 import EditScreen from '@screens/EditScreen';
 import PartstechnicalScreen from '@screens/PartstechnicalScreen';
 import HelpdeskScreen from '@screens/HelpdeskScreen';
 import MenuSearch from '@screens/MenuSearchScreen';
 import SearchAllTR from '@screens/SearchAllTRScreen';
  import MyTechnicalScreenEdit from '@screens/MyTechnicalScreenEdit';
  import ConditionScreen from '@screens/ConditionScreen';
import ViewScreenalltrScreen from '@screens/ViewScreenalltr';
import PdfScreen from '@screens/PdfScreen'
const AppNavigator = createAppContainer (
						createStackNavigator(
							{
								LoginScreen: {screen: LoginScreen},
								MyTechnicalScreen: {screen: MyTechnicalScreen},
								AllTechnicalScreen: {screen: AllTechnicalScreen},
								ProductScreen: {screen: ProductScreen},
								DimensionScreen: {screen: DimensionScreen},
								ViewScreen : {screen : ViewScreen},
								ReferencesScreen: {screen: ReferencesScreen},
								WarrantyScreen: {screen: WarrantyScreen},
								GoodwillScreen: {screen: GoodwillScreen},
								PasswordScreen: {screen: PasswordScreen},
								TelematicsScreen: {screen: TelematicsScreen},
								DppmScreen: {screen: DppmScreen},
								ReopenScreen: {screen: ReopenScreen},
								PartstechnicalScreen: {screen: PartstechnicalScreen},
								HelpdeskScreen: {screen: HelpdeskScreen},
								EditScreen: {screen: EditScreen},
								MenuSearch : {screen: MenuSearch},
								SearchAllTR : {screen: SearchAllTR},
								MyTechnicalScreenEdit: {screen: MyTechnicalScreenEdit},
								ConditionScreen: {screen: ConditionScreen},
								ViewScreenalltr: { screen: ViewScreenalltrScreen},
								PdfScreen: {screen: PdfScreen}
								
							},
							{
								headerMode: 'none'
							}
						)
					);

 export default AppNavigator;
