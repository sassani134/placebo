import React from 'react';
import {
    ImageBackground,
    Text,
    View,
    TextInput
} from 'react-native';
import { useState } from 'react/cjs/react.development';

import { styles } from './styles';

export const BarcodeRow = ({ result = {} }) => {



    const { data, symbology } = result;
    //const [count, setcount] = useState(result.itemCount);
    
    result.itemCount = 888
    // const updateValue = (x) => {

    //     console.log('counttttttttttttttttt')
    //     console.log(count)
    //     console.log('counttttttttttttttttt')



        
    //     setcount(0);
    //     setcount(x);
    //     result.itemCount = 888
    // }


    

    return (
        <View style={styles.result}>
            <ImageBackground source={require('./images/barcode_black.png')} style={styles.resultImage} />

            <View style={styles.resultDataContainer}>
                <Text style={styles.resultSymbology}>{symbology}</Text>
                <Text style={styles.resultData}>{data}</Text>

                <View style={styles.resultStockContainer}>
                    <View style={styles.resultStockCircle}>
                        <Text style={styles.resultStockCircleText}>-</Text>
                    </View>


                    <Text style={styles.resultStockCount}>{result.itemCount}</Text>                    
                    
    
                    <View style={styles.resultStockCircle}>
                        <Text style={styles.resultStockCircleText}>+</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}